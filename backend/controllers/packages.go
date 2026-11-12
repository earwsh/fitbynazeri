package controllers

import (
	"encoding/json"
	"fmt"
	"strings"
	"backend/database"
	"backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// RequireSuperAdmin فقط توکن معتبر با نقش سوپروایزر را عبور می‌دهد
func RequireSuperAdmin(c *fiber.Ctx) error {
	if status, msg := checkSuperAdmin(c); status != 0 {
		return c.Status(status).JSON(fiber.Map{"status": "error", "message": msg})
	}
	return c.Next()
}

// checkSuperAdmin در صورت مجاز بودن کد ۰ و در غیر این صورت کد خطا و پیام را برمی‌گرداند
func checkSuperAdmin(c *fiber.Ctx) (int, string) {
	header := c.Get("Authorization")
	tokenStr := strings.TrimSpace(strings.TrimPrefix(header, "Bearer "))
	if tokenStr == "" {
		return fiber.StatusUnauthorized, "ابتدا وارد حساب کاربری شوید"
	}
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) { return JwtSecret, nil }, jwt.WithValidMethods([]string{"HS256"}))
	if err != nil || !token.Valid {
		return fiber.StatusUnauthorized, "نشست ورود نامعتبر یا منقضی است"
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["role"] != string(models.RoleSuperAdmin) {
		return fiber.StatusForbidden, "فقط سوپروایزر به مدیریت پکیج‌ها دسترسی دارد"
	}
	return 0, ""
}

type packageInput struct {
	Title          string   `json:"title"`
	Subtitle       string   `json:"subtitle"`
	Kind           string   `json:"kind"`
	DurationMonths int      `json:"duration_months"`
	Price          int64    `json:"price"`
	OldPrice       int64    `json:"old_price"`
	Badge          string   `json:"badge"`
	Popular        bool     `json:"popular"`
	Features       []string `json:"features"`
	BtnText        string   `json:"btn_text"`
	IsActive       bool     `json:"is_active"`
	SortOrder      int      `json:"sort_order"`
}

func (in *packageInput) validate() string {
	in.Title = strings.TrimSpace(in.Title)
	if in.Title == "" {
		return "عنوان پکیج الزامی است"
	}
	if in.Kind != "workout" && in.Kind != "diet" && in.Kind != "combo" {
		return "نوع پکیج باید تمرین، تغذیه یا ترکیبی باشد"
	}
	if in.DurationMonths < 1 {
		return "مدت پکیج باید حداقل ۱ ماه باشد"
	}
	if in.Price < 0 {
		return "قیمت نامعتبر است"
	}
	return ""
}

func featuresToJSON(f []string) string {
	clean := []string{}
	for _, s := range f {
		if s = strings.TrimSpace(s); s != "" {
			clean = append(clean, s)
		}
	}
	b, _ := json.Marshal(clean)
	return string(b)
}

func applyPackageInput(p *models.PlanPackage, in packageInput) {
	p.Title = in.Title
	p.Subtitle = in.Subtitle
	p.Kind = in.Kind
	p.DurationMonths = in.DurationMonths
	p.Price = in.Price
	p.OldPrice = in.OldPrice
	p.Badge = in.Badge
	p.Popular = in.Popular
	p.Features = featuresToJSON(in.Features)
	p.BtnText = in.BtnText
	p.IsActive = in.IsActive
	p.SortOrder = in.SortOrder
}

// GetPlanPackages: عمومی؛ فقط پکیج‌های فعال. با ?all=1 و نقش سوپروایزر همه را برمی‌گرداند
func GetPlanPackages(c *fiber.Ctx) error {
	var list []models.PlanPackage
	q := database.DB.Order("sort_order asc, duration_months asc, id asc")
	if c.Query("all") == "1" {
		if status, msg := checkSuperAdmin(c); status != 0 {
			return c.Status(status).JSON(fiber.Map{"status": "error", "message": msg})
		}
	} else {
		q = q.Where("is_active = ?", true)
	}
	q.Find(&list)
	return c.JSON(fiber.Map{"status": "success", "packages": list})
}

func GetPlanPackageBySlug(c *fiber.Ctx) error {
	var p models.PlanPackage
	if err := database.DB.Where("slug = ? AND is_active = ?", c.Params("slug"), true).First(&p).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "پکیج یافت نشد"})
	}
	return c.JSON(fiber.Map{"status": "success", "package": p})
}

func CreatePlanPackage(c *fiber.Ctx) error {
	var in packageInput
	if err := c.BodyParser(&in); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "فرمت داده‌ها نامعتبر است"})
	}
	if msg := in.validate(); msg != "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": msg})
	}
	p := models.PlanPackage{}
	applyPackageInput(&p, in)
	p.Slug = fmt.Sprintf("tmp-%d", database.DB.NowFunc().UnixNano())
	if err := database.DB.Create(&p).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "خطا در ثبت پکیج"})
	}
	database.DB.Model(&p).Update("slug", fmt.Sprintf("pkg-%d", p.ID))
	p.Slug = fmt.Sprintf("pkg-%d", p.ID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "package": p})
}

func UpdatePlanPackage(c *fiber.Ctx) error {
	var p models.PlanPackage
	if err := database.DB.First(&p, c.Params("id")).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "پکیج یافت نشد"})
	}
	var in packageInput
	if err := c.BodyParser(&in); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "فرمت داده‌ها نامعتبر است"})
	}
	if msg := in.validate(); msg != "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": msg})
	}
	applyPackageInput(&p, in)
	database.DB.Save(&p)
	return c.JSON(fiber.Map{"status": "success", "package": p})
}

// DeletePlanPackage: اگر برای پکیج سفارشی ثبت شده باشد فقط غیرفعال می‌شود
func DeletePlanPackage(c *fiber.Ctx) error {
	var p models.PlanPackage
	if err := database.DB.First(&p, c.Params("id")).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "پکیج یافت نشد"})
	}
	var used int64
	database.DB.Model(&models.PlanOrder{}).Where("package_slug = ?", p.Slug).Count(&used)
	if used > 0 {
		database.DB.Model(&p).Update("is_active", false)
		return c.JSON(fiber.Map{"status": "success", "deactivated": true, "message": "برای این پکیج سفارش ثبت شده؛ به‌جای حذف، غیرفعال شد"})
	}
	database.DB.Delete(&p)
	return c.JSON(fiber.Map{"status": "success", "deleted": true})
}

var faDigits = strings.NewReplacer("0", "۰", "1", "۱", "2", "۲", "3", "۳", "4", "۴", "5", "۵", "6", "۶", "7", "۷", "8", "۸", "9", "۹")

// FormatToman مثال: 1590000 -> «۱,۵۹۰,۰۰۰ تومان»
func FormatToman(n int64) string {
	s := fmt.Sprintf("%d", n)
	var out []string
	for len(s) > 3 {
		out = append([]string{s[len(s)-3:]}, out...)
		s = s[:len(s)-3]
	}
	out = append([]string{s}, out...)
	return faDigits.Replace(strings.Join(out, ",")) + " تومان"
}
