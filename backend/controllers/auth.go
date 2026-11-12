package controllers

import (
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
	"strings"
	"time"
	"backend/database"
	"backend/models"
	"github.com/disintegration/imaging"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var JwtSecret = []byte("nazeri-super-secret-jwt-key-2026")

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "ایمیل یا کلمه عبور اشتباه است",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "ایمیل یا کلمه عبور اشتباه است",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(JwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در تولید نشست ورود",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"token":  tokenString,
		"user":   user,
	})
}

func GetUsers(c *fiber.Ctx) error {
	var users []models.User
	database.DB.Order("created_at desc").Find(&users)
	return c.JSON(fiber.Map{
		"status": "success",
		"users":  users,
	})
}

func CreateUser(c *fiber.Ctx) error {
	var input struct {
		FullName string      `json:"full_name"`
		Email    string      `json:"email"`
		Phone    string      `json:"phone"`
		Password string      `json:"password"`
		Role     models.Role `json:"role"`
		Avatar   string      `json:"avatar"`
		IsActive bool        `json:"is_active"`
	}

	if err := c.BodyParser(&input); err != nil || input.Email == "" || input.FullName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "نام و ایمیل الزامی است",
		})
	}

	if input.Password == "" {
		input.Password = "123456" // کلمه عبور پیش‌فرض
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در رمزنگاری کلمه عبور",
		})
	}

	if input.Role == "" {
		input.Role = models.RoleStudent
	}

	user := models.User{
		FullName:  input.FullName,
		Email:     strings.ToLower(strings.TrimSpace(input.Email)),
		Phone:     input.Phone,
		Password:  string(hashedPassword),
		Role:      input.Role,
		Avatar:    input.Avatar,
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "کاربری با این ایمیل یا شماره تلفن از قبل وجود دارد",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "کاربر جدید با موفقیت ثبت شد",
		"user":    user,
	})
}

func UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		FullName string      `json:"full_name"`
		Email    string      `json:"email"`
		Phone    string      `json:"phone"`
		Password string      `json:"password"`
		Role     models.Role `json:"role"`
		Avatar   string      `json:"avatar"`
		IsActive *bool       `json:"is_active"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "داده‌های ارسالی نامعتبر است",
		})
	}

	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "کاربر یافت نشد",
		})
	}

	if input.FullName != "" {
		user.FullName = input.FullName
	}
	if input.Email != "" {
		user.Email = strings.ToLower(strings.TrimSpace(input.Email))
	}
	if input.Phone != "" {
		user.Phone = input.Phone
	}
	if input.Role != "" {
		user.Role = input.Role
	}
	if input.Avatar != "" {
		user.Avatar = input.Avatar
	}
	if input.IsActive != nil {
		user.IsActive = *input.IsActive
	}
	if input.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err == nil {
			user.Password = string(hashed)
		}
	}
	user.UpdatedAt = time.Now()

	database.DB.Save(&user)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
		"user":    user,
	})
}

func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.User{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف کاربر",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "کاربر با موفقیت حذف شد",
	})
}

// ========== اندپوینت‌های دسته‌بندی مقالات وبلاگ (Blog Categories CRUD) ==========

func GetBlogCategories(c *fiber.Ctx) error {
	var categories []models.BlogCategory
	database.DB.Order("id asc").Find(&categories)
	return c.JSON(fiber.Map{
		"status":     "success",
		"categories": categories,
	})
}

func CreateBlogCategory(c *fiber.Ctx) error {
	var input models.BlogCategory
	if err := c.BodyParser(&input); err != nil || input.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "نام دسته‌بندی الزامی است",
		})
	}

	if input.Slug == "" {
		input.Slug = strings.ToLower(strings.TrimSpace(strings.ReplaceAll(input.Name, " ", "-")))
	}

	var existing models.BlogCategory
	if err := database.DB.Where("slug = ?", input.Slug).First(&existing).Error; err == nil {
		input.Slug = fmt.Sprintf("%s-%d", input.Slug, time.Now().Unix()%1000)
	}

	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":   "success",
		"message":  "دسته‌بندی جدید با موفقیت ایجاد شد",
		"category": input,
	})
}

func DeleteBlogCategory(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.BlogCategory{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف دسته‌بندی",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "دسته‌بندی با موفقیت حذف شد",
	})
}

// ========== اندپوینت‌های وبلاگ و مقالات تخصصی (Blog Posts CRUD) ==========

// دریافت تمام مقالات برای صفحه اصلی و آرشیو وبلاگ و پنل ادمین
func GetBlogPosts(c *fiber.Ctx) error {
	var posts []models.BlogPost
	database.DB.Order("created_at desc").Find(&posts)
	return c.JSON(fiber.Map{
		"status": "success",
		"posts":  posts,
	})
}

// دریافت یک مقاله با اسلاگ (Slug)
func GetBlogPostBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var post models.BlogPost
	if err := database.DB.Where("slug = ?", slug).First(&post).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "مقاله مورد نظر یافت نشد",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"post":   post,
	})
}

// ایجاد مقاله جدید (انتشار یا پیش‌نویس)
func CreateBlogPost(c *fiber.Ctx) error {
	var input models.BlogPost
	if err := c.BodyParser(&input); err != nil || input.Title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "عنوان مقاله الزامی است",
		})
	}

	if input.Slug == "" {
		input.Slug = fmt.Sprintf("post-%d", time.Now().Unix())
	}
	input.Slug = strings.ToLower(strings.TrimSpace(strings.ReplaceAll(input.Slug, " ", "-")))

	var existing models.BlogPost
	if err := database.DB.Where("slug = ?", input.Slug).First(&existing).Error; err == nil {
		input.Slug = fmt.Sprintf("%s-%d", input.Slug, time.Now().Unix()%1000)
	}

	if input.AuthorName == "" {
		input.AuthorName = "استاد احسان ناظری"
	}
	if input.AuthorRole == "" {
		input.AuthorRole = "مربی ارشد بدنسازی"
	}
	if input.ReadTime == "" {
		input.ReadTime = "۵ دقیقه مطالعه"
	}
	if input.ImageURL == "" {
		input.ImageURL = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
	}
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "مقاله با موفقیت در سیستم ثبت شد",
		"post":    input,
	})
}

// ویرایش مقاله
func UpdateBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")
	var input models.BlogPost
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var post models.BlogPost
	if err := database.DB.First(&post, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "مقاله مورد نظر یافت نشد",
		})
	}

	if input.Slug != "" {
		post.Slug = strings.ToLower(strings.TrimSpace(strings.ReplaceAll(input.Slug, " ", "-")))
	}
	post.Title = input.Title
	post.Excerpt = input.Excerpt
	post.Content = input.Content
	post.Category = input.Category
	post.AuthorName = input.AuthorName
	post.AuthorRole = input.AuthorRole
	post.ReadTime = input.ReadTime
	post.ImageURL = input.ImageURL
	post.Tags = input.Tags
	post.ImageAlt = input.ImageAlt
	post.MetaTitle = input.MetaTitle
	post.MetaDescription = input.MetaDescription
	post.FocusKeyword = input.FocusKeyword
	post.FaqTitle = input.FaqTitle
	post.FaqItems = input.FaqItems
	post.IsPublished = input.IsPublished
	post.UpdatedAt = time.Now()

	database.DB.Save(&post)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "مقاله با موفقیت به‌روزرسانی شد",
		"post":    post,
	})
}

// حذف مقاله
func DeleteBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.BlogPost{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف مقاله",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "مقاله با موفقیت حذف گردید",
	})
}

// ========== اندپوینت‌های دیدگاه‌های مقالات وبلاگ (Blog Comments CRUD) ==========

// دریافت دیدگاه‌های تایید شده یک مقاله خاص
func GetPostBlogComments(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var list []models.BlogComment
	database.DB.Where("post_slug = ? AND status = ?", slug, "approved").Order("created_at desc").Find(&list)
	return c.JSON(fiber.Map{
		"status":   "success",
		"comments": list,
	})
}

// دریافت کلیه دیدگاه‌های مقالات برای پنل ادمین
func GetAllBlogComments(c *fiber.Ctx) error {
	var list []models.BlogComment
	database.DB.Order("created_at desc").Find(&list)
	return c.JSON(fiber.Map{
		"status":   "success",
		"comments": list,
	})
}

// ثبت دیدگاه جدید توسط کاربر
func CreateBlogComment(c *fiber.Ctx) error {
	var input models.BlogComment
	if err := c.BodyParser(&input); err != nil || input.Comment == "" || input.FullName == "" || input.PostSlug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "لطفاً نام، متن دیدگاه و مقاله مربوطه را به درستی ارسال فرمایید",
		})
	}

	if input.Rating <= 0 || input.Rating > 5 {
		input.Rating = 5
	}
	input.Status = "pending" // نیاز به تایید مربی/ادمین
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "دیدگاه شما با موفقیت ثبت شد و پس از بررسی مربی نمایش داده خواهد شد",
		"comment": input,
	})
}

// تایید، رد یا تغییر وضعیت دیدگاه
func UpdateBlogCommentStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Status string `json:"status"` // approved, rejected, pending
	}

	if err := c.BodyParser(&input); err != nil || input.Status == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "وضعیت معتبر الزامی است",
		})
	}

	var comment models.BlogComment
	if err := database.DB.First(&comment, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "دیدگاه مورد نظر یافت نشد",
		})
	}

	comment.Status = input.Status
	comment.UpdatedAt = time.Now()
	database.DB.Save(&comment)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "وضعیت دیدگاه با موفقیت تغییر یافت",
		"comment": comment,
	})
}

// ارسال یا ویرایش پاسخ مربی به دیدگاه
func ReplyBlogComment(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Reply       string `json:"reply"`
		ReplyAuthor string `json:"reply_author"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "متن پاسخ الزامی است",
		})
	}

	var comment models.BlogComment
	if err := database.DB.First(&comment, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "دیدگاه مورد نظر یافت نشد",
		})
	}

	now := time.Now()
	comment.Reply = input.Reply
	if input.ReplyAuthor != "" {
		comment.ReplyAuthor = input.ReplyAuthor
	} else {
		comment.ReplyAuthor = "استاد احسان ناظری"
	}
	comment.ReplyCreatedAt = &now
	comment.UpdatedAt = now

	// اگر دیدگاه هنوز تایید نشده بود، هنگام پاسخ دادن خودکار تایید هم شود
	if comment.Status == "pending" {
		comment.Status = "approved"
	}

	database.DB.Save(&comment)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "پاسخ مربی با موفقیت ثبت شد",
		"comment": comment,
	})
}

// حذف دیدگاه
func DeleteBlogComment(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.BlogComment{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف دیدگاه",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "دیدگاه با موفقیت حذف گردید",
	})
}

// ========== اندپوینت‌های نظرات و دیدگاه‌های قهرمانان (Testimonials CRUD) ==========

// دریافت نظرات تایید شده برای صفحه اصلی
func GetPublicTestimonials(c *fiber.Ctx) error {
	var list []models.Testimonial
	database.DB.Where("status = ?", "approved").Order("created_at desc").Find(&list)
	return c.JSON(fiber.Map{
		"status":       "success",
		"testimonials": list,
	})
}

// دریافت تمامی نظرات (برای پنل ادمین)
func GetAllTestimonials(c *fiber.Ctx) error {
	var list []models.Testimonial
	database.DB.Order("created_at desc").Find(&list)
	return c.JSON(fiber.Map{
		"status":       "success",
		"testimonials": list,
	})
}

// ثبت نظر جدید توسط کاربر (در انتظار تایید)
func CreateTestimonial(c *fiber.Ctx) error {
	var input models.Testimonial
	if err := c.BodyParser(&input); err != nil || input.FullName == "" || input.Comment == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "لطفاً نام و متن دیدگاه خود را وارد نمایید",
		})
	}

	input.Status = "pending"
	if input.Rating <= 0 || input.Rating > 5 {
		input.Rating = 5
	}
	if input.Avatar == "" {
		input.Avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
	}
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":      "success",
		"message":     "دیدگاه شما با موفقیت ثبت شد و پس از بررسی و تایید مربی در سایت نمایش داده می‌شود",
		"testimonial": input,
	})
}

// تغییر وضعیت نظر (تایید / رد) توسط مربی یا ادمین
func UpdateTestimonialStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Status string `json:"status"` // approved, pending, rejected
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var item models.Testimonial
	if err := database.DB.First(&item, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "دیدگاه مورد نظر یافت نشد",
		})
	}

	item.Status = input.Status
	item.UpdatedAt = time.Now()
	database.DB.Save(&item)

	return c.JSON(fiber.Map{
		"status":      "success",
		"message":     "وضعیت نمایش دیدگاه با موفقیت به‌روزرسانی شد",
		"testimonial": item,
	})
}

// حذف دیدگاه توسط مربی یا ادمین
func DeleteTestimonial(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.Testimonial{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف دیدگاه",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "دیدگاه با موفقیت حذف گردید",
	})
}

// ========== اندپوینت‌های مدیریت قهرمانان (Student Profiles CRUD) ==========

func GetStudents(c *fiber.Ctx) error {
	var students []models.StudentProfile
	database.DB.Order("created_at desc").Find(&students)
	return c.JSON(fiber.Map{
		"status":   "success",
		"students": students,
	})
}

func GetStudentBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")
	var student models.StudentProfile
	if err := database.DB.Where("slug = ?", slug).First(&student).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "قهرمان با این آدرس پیدا نشد",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"student": student,
	})
}

func CreateStudent(c *fiber.Ctx) error {
	var input models.StudentProfile
	if err := c.BodyParser(&input); err != nil || input.FullName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "لطفاً نام و مشخصات قهرمان را وارد نمایید",
		})
	}

	if input.Slug == "" {
		input.Slug = fmt.Sprintf("student-%d", time.Now().Unix())
	}
	input.Slug = strings.ToLower(strings.TrimSpace(strings.ReplaceAll(input.Slug, " ", "-")))

	var existing models.StudentProfile
	if err := database.DB.Where("slug = ?", input.Slug).First(&existing).Error; err == nil {
		input.Slug = fmt.Sprintf("%s-%d", input.Slug, time.Now().Unix()%1000)
	}

	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "پرونده قهرمان با موفقیت ایجاد شد",
		"student": input,
	})
}

func UpdateStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	var input models.StudentProfile
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var student models.StudentProfile
	if err := database.DB.First(&student, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "قهرمان مورد نظر یافت نشد",
		})
	}

	if input.Slug != "" {
		student.Slug = strings.ToLower(strings.TrimSpace(strings.ReplaceAll(input.Slug, " ", "-")))
	}
	student.FullName = input.FullName
	student.Phone = input.Phone
	student.Email = input.Email
	student.Category = input.Category
	student.PackageName = input.PackageName
	student.Duration = input.Duration
	student.ImageURL = input.ImageURL
	student.InitialWeight = input.InitialWeight
	student.CurrentWeight = input.CurrentWeight
	student.TargetWeight = input.TargetWeight
	student.Height = input.Height
	student.Age = input.Age
	student.BodyFat = input.BodyFat
	student.Medals = input.Medals
	student.Bio = input.Bio
	student.CoachNotes = input.CoachNotes
	student.Status = input.Status
	student.IsChampion = input.IsChampion
	student.UpdatedAt = time.Now()

	database.DB.Save(&student)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اطلاعات قهرمان با موفقیت به‌روزرسانی شد",
		"student": student,
	})
}

func DeleteStudent(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.StudentProfile{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف قهرمان",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "قهرمان با موفقیت حذف گردید",
	})
}

// ========== اندپوینت‌های سئو ==========
func GetSEO(c *fiber.Ctx) error {
	var seo models.SiteSEO
	database.DB.First(&seo)
	return c.JSON(fiber.Map{
		"status": "success",
		"seo":    seo,
	})
}

func UpdateSEO(c *fiber.Ctx) error {
	var input models.SiteSEO
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "اطلاعات سئو نامعتبر است",
		})
	}

	var existing models.SiteSEO
	database.DB.First(&existing)
	existing.MetaTitle = input.MetaTitle
	existing.MetaDesc = input.MetaDesc
	existing.Keywords = input.Keywords
	existing.CanonicalURL = input.CanonicalURL
	existing.RobotsIndex = input.RobotsIndex
	existing.GoogleAnalyticsID = input.GoogleAnalyticsID
	existing.SchemaJson = input.SchemaJson

	database.DB.Save(&existing)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "تنظیمات سئو سایت با موفقیت به‌روزرسانی شد",
		"seo":     existing,
	})
}

// ========== اندپوینت‌های هیروسکشن ==========
func GetHeroSlides(c *fiber.Ctx) error {
	var slides []models.HeroSlide
	database.DB.Order("order_index asc").Find(&slides)
	return c.JSON(fiber.Map{
		"status": "success",
		"slides": slides,
	})
}

func UpdateHeroSlide(c *fiber.Ctx) error {
	id := c.Params("id")
	var input models.HeroSlide
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var slide models.HeroSlide
	if err := database.DB.First(&slide, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "اسلاید مورد نظر یافت نشد",
		})
	}

	slide.TitlePrefix = input.TitlePrefix
	slide.TitleHighlight = input.TitleHighlight
	slide.Description = input.Description
	slide.PrimaryBtnText = input.PrimaryBtnText
	slide.PrimaryBtnHref = input.PrimaryBtnHref
	slide.SecondaryBtnText = input.SecondaryBtnText
	slide.SecondaryBtnHref = input.SecondaryBtnHref
	slide.ImageURL = input.ImageURL
	slide.IsActive = input.IsActive

	database.DB.Save(&slide)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اسلاید هیروسکشن با موفقیت ذخیره و به‌روزرسانی شد",
		"slide":   slide,
	})
}

// ========== اندپوینت‌های سکشن درباره ما (About CMS) ==========
func GetAboutSection(c *fiber.Ctx) error {
	var about models.AboutSection
	database.DB.First(&about)
	return c.JSON(fiber.Map{
		"status": "success",
		"about":  about,
	})
}

func UpdateAboutSection(c *fiber.Ctx) error {
	var input models.AboutSection
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var about models.AboutSection
	database.DB.First(&about)

	about.TitlePrefix = input.TitlePrefix
	about.TitleHighlight = input.TitleHighlight
	about.Paragraph1 = input.Paragraph1
	about.Paragraph2 = input.Paragraph2
	about.CoachName = input.CoachName
	about.CoachRole = input.CoachRole
	about.ExperienceBadge = input.ExperienceBadge
	about.CoachImageURL = input.CoachImageURL
	about.Card1Title = input.Card1Title
	about.Card1Desc = input.Card1Desc
	about.Card2Title = input.Card2Title
	about.Card2Desc = input.Card2Desc
	about.Card3Title = input.Card3Title
	about.Card3Desc = input.Card3Desc
	about.Card4Title = input.Card4Title
	about.Card4Desc = input.Card4Desc
	about.BtnText = input.BtnText
	about.BtnHref = input.BtnHref
	about.UpdatedAt = time.Now()

	database.DB.Save(&about)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اطلاعات بخش درباره ما با موفقیت به‌روزرسانی شد",
		"about":   about,
	})
}

// ========== اندپوینت‌های درخواست مشاوره رایگان (Consultation Requests) ==========

func GetConsultationRequests(c *fiber.Ctx) error {
	var requests []models.ConsultationRequest
	database.DB.Order("created_at desc").Find(&requests)
	return c.JSON(fiber.Map{
		"status":   "success",
		"requests": requests,
	})
}

func CreateConsultationRequest(c *fiber.Ctx) error {
	var input models.ConsultationRequest
	if err := c.BodyParser(&input); err != nil || input.FullName == "" || input.Phone == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "لطفاً نام و شماره تماس خود را به درستی وارد نمایید",
		})
	}

	input.Status = "pending"
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	database.DB.Create(&input)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "درخواست مشاوره شما با موفقیت ثبت شد و به زودی با شما تماس خواهیم گرفت",
		"request": input,
	})
}

func UpdateConsultationStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Status string `json:"status"`
		Notes  string `json:"notes"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var req models.ConsultationRequest
	if err := database.DB.First(&req, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "درخواست مشاوره یافت نشد",
		})
	}

	if input.Status != "" {
		req.Status = input.Status
	}
	req.Notes = input.Notes
	req.UpdatedAt = time.Now()

	database.DB.Save(&req)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "وضعیت درخواست مشاوره به‌روزرسانی شد",
		"request": req,
	})
}

// ========== اندپوینت‌های مدیریت مدیا، اپتیمایز و سئو تصویر ==========

func GetMediaList(c *fiber.Ctx) error {
	var media []models.MediaFile
	database.DB.Order("created_at desc").Find(&media)
	return c.JSON(fiber.Map{
		"status": "success",
		"media":  media,
	})
}

func UpdateMediaSEO(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		FileName string `json:"file_name"`
		AltText  string `json:"alt_text"`
		Title    string `json:"title"`
		Caption  string `json:"caption"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var media models.MediaFile
	if err := database.DB.First(&media, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "فایل مورد نظر یافت نشد",
		})
	}

	if input.FileName != "" {
		media.FileName = input.FileName
	}
	media.AltText = input.AltText
	media.Title = input.Title
	media.Caption = input.Caption
	media.UpdatedAt = time.Now()

	database.DB.Save(&media)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اطلاعات سئو و نام تصویر با موفقیت به‌روزرسانی شد",
		"media":   media,
	})
}

func DeleteMedia(c *fiber.Ctx) error {
	id := c.Params("id")
	var media models.MediaFile
	if err := database.DB.First(&media, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "فایل مورد نظر یافت نشد",
		})
	}

	parts := strings.Split(media.FileURL, "/uploads/")
	if len(parts) == 2 {
		_ = os.Remove(fmt.Sprintf("./uploads/%s", parts[1]))
	}

	database.DB.Delete(&media)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "فایل با موفقیت از آرشیو رسانه حذف شد",
	})
}

func UploadMedia(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "هیچ فایلی برای آپلود انتخاب نشده است",
		})
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	uniqueName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	savePath := fmt.Sprintf("./uploads/%s", uniqueName)

	if err := c.SaveFile(file, savePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در ذخیره‌سازی فایل روی دیسک",
		})
	}

	fileType := "document"
	width := 0
	height := 0
	isOptimized := false
	finalSize := file.Size

	if ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".webp" {
		fileType = "image"
		srcImg, err := imaging.Open(savePath)
		if err == nil {
			bounds := srcImg.Bounds()
			width = bounds.Dx()
			height = bounds.Dy()

			var processedImg image.Image = srcImg
			if width > 1920 {
				processedImg = imaging.Resize(srcImg, 1920, 0, imaging.Lanczos)
				width = processedImg.Bounds().Dx()
				height = processedImg.Bounds().Dy()
			}

			outF, err := os.Create(savePath)
			if err == nil {
				if ext == ".png" {
					_ = png.Encode(outF, processedImg)
				} else {
					_ = jpeg.Encode(outF, processedImg, &jpeg.Options{Quality: 82})
				}
				outF.Close()

				if stat, err := os.Stat(savePath); err == nil {
					finalSize = stat.Size()
					isOptimized = true
				}
			}
		}
	} else if ext == ".mp4" || ext == ".webm" || ext == ".mov" {
		fileType = "video"
	}

	fileURL := fmt.Sprintf("https://fitbynazeri.com/uploads/%s", uniqueName)

	cleanName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
	defaultAlt := strings.ReplaceAll(cleanName, "_", " ")
	defaultAlt = strings.ReplaceAll(defaultAlt, "-", " ")

	mediaFile := models.MediaFile{
		FileName:    file.Filename,
		AltText:     defaultAlt,
		Title:       defaultAlt,
		Caption:     "",
		FileURL:     fileURL,
		FileType:    fileType,
		MimeType:    file.Header.Get("Content-Type"),
		FileSize:    finalSize,
		Width:       width,
		Height:      height,
		IsOptimized: isOptimized,
	}

	database.DB.Create(&mediaFile)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "فایل با موفقیت آپلود و با الگوریتم Go فشرده و بهینه‌سازی شد 🚀",
		"media":   mediaFile,
	})
}

// ========== اندپوینت‌های سفارش و پرونده‌های برنامه قهرمانان (Plan Orders CRUD) ==========

func CreatePlanOrder(c *fiber.Ctx) error {
	var input struct {
		UserID              uint    `json:"user_id"`
		UserEmail           string  `json:"user_email"`
		UserName            string  `json:"user_name"`
		UserPhone           string  `json:"user_phone"`
		PackageType         string  `json:"package_type"`
		PackageTitle        string  `json:"package_title"`
		Price               string  `json:"price"`
		PackageSlug         string  `json:"package_slug"`
		Age                int     `json:"age"`
		Gender              string  `json:"gender"`
		Height              int     `json:"height"`
		Weight              float64 `json:"weight"`
		ActivityLevel       string  `json:"activity_level"`
		PrimaryGoal         string  `json:"primary_goal"`
		TrainingLocation    string  `json:"training_location"`
		ExperienceLevel     string  `json:"experience_level"`
		DaysPerWeek         string  `json:"days_per_week"`
		Injuries            string  `json:"injuries"`
		DietaryRestrictions string `json:"dietary_restrictions"`
		DailyMealsCount     string  `json:"daily_meals_count"`
		Supplements         string  `json:"supplements"`
		CoachNotes          string  `json:"coach_notes"`
		WorkoutPlanContent  string  `json:"workout_plan_content"`
		DietPlanContent     string  `json:"diet_plan_content"`
		PhotosJson          string  `json:"photos_json"`
	}

	if err := c.BodyParser(&input); err != nil || input.UserEmail == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "اطلاعات ارسالی پرسشنامه ناقص است",
		})
	}

	// عنوان، نوع، قیمت و مدت از روی پکیج ثبت‌شده در دیتابیس تعیین می‌شود (نه از ورودی کاربر)
	durationMonths := 0
	if input.PackageSlug != "" {
		var pkg models.PlanPackage
		if err := database.DB.Where("slug = ? AND is_active = ?", input.PackageSlug, true).First(&pkg).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "پکیج انتخاب‌شده موجود یا فعال نیست",
			})
		}
		input.PackageType = pkg.Kind
		input.PackageTitle = fmt.Sprintf("%s (%d ماهه)", pkg.Title, pkg.DurationMonths)
		input.Price = FormatToman(pkg.Price)
		durationMonths = pkg.DurationMonths
	}

	order := models.PlanOrder{
		PackageSlug:         input.PackageSlug,
		DurationMonths:      durationMonths,
		UserID:              input.UserID,
		UserEmail:           strings.ToLower(strings.TrimSpace(input.UserEmail)),
		UserName:            input.UserName,
		UserPhone:           input.UserPhone,
		PackageType:         input.PackageType,
		PackageTitle:        input.PackageTitle,
		Price:               input.Price,
		PaymentStatus:       "paid", // فرض پرداخت موفقیت‌آمیز در فرآیند ثبت
		Status:              "reviewing", // در حال بررسی اولیه توسط مربی
		Age:                 input.Age,
		Gender:              input.Gender,
		Height:              input.Height,
		Weight:              input.Weight,
		ActivityLevel:       input.ActivityLevel,
		PrimaryGoal:         input.PrimaryGoal,
		TrainingLocation:    input.TrainingLocation,
		ExperienceLevel:     input.ExperienceLevel,
		DaysPerWeek:         input.DaysPerWeek,
		Injuries:            input.Injuries,
		DietaryRestrictions: input.DietaryRestrictions,
		DailyMealsCount:     input.DailyMealsCount,
		Supplements:         input.Supplements,
		CoachNotes:          input.CoachNotes,
		WorkoutPlanContent:  input.WorkoutPlanContent,
		DietPlanContent:     input.DietPlanContent,
		PhotosJson:          input.PhotosJson,
		EstimatedDelivery:   "۲۴ الی ۴۸ ساعت کاری",
		AdminFeedback:       "پرسشنامه شما دریافت شد. در حال طراحی اختصاصی برنامه تمرینی و تغذیه متناسب با فیزیک بدنی شما هستیم.",
		CreatedAt:           time.Now(),
		UpdatedAt:           time.Now(),
	}

	if err := database.DB.Create(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در ثبت سفارش برنامه در دیتابیس",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "پرونده و درخواست برنامه شما با موفقیت ثبت شد",
		"order":   order,
	})
}

func GetUserPlanOrders(c *fiber.Ctx) error {
	email := strings.ToLower(strings.TrimSpace(c.Params("email")))
	var orders []models.PlanOrder
	database.DB.Where("user_email = ?", email).Order("created_at desc").Find(&orders)
	return c.JSON(fiber.Map{
		"status": "success",
		"orders": orders,
	})
}

func GetAllPlanOrders(c *fiber.Ctx) error {
	var orders []models.PlanOrder
	database.DB.Order("created_at desc").Find(&orders)
	return c.JSON(fiber.Map{
		"status": "success",
		"orders": orders,
	})
}

func UpdatePlanOrderStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var input struct {
		Status               string  `json:"status"` // reviewing, preparing, ready, completed
		AdminFeedback        string  `json:"admin_feedback"`
		WorkoutPlanFile      string  `json:"workout_plan_file"`
		DietPlanFile         string  `json:"diet_plan_file"`
		EstimatedDelivery    string  `json:"estimated_delivery"`
		Age                  int     `json:"age"`
		Gender               string  `json:"gender"`
		Height               int     `json:"height"`
		Weight               float64 `json:"weight"`
		ActivityLevel        string  `json:"activity_level"`
		PrimaryGoal          string  `json:"primary_goal"`
		TrainingLocation     string  `json:"training_location"`
		ExperienceLevel      string  `json:"experience_level"`
		DaysPerWeek          string  `json:"days_per_week"`
		Injuries             string  `json:"injuries"`
		DietaryRestrictions string  `json:"dietary_restrictions"`
		DailyMealsCount      string  `json:"daily_meals_count"`
		CoachNotes           string  `json:"coach_notes"`
		WorkoutPlanContent   string  `json:"workout_plan_content"`
		DietPlanContent      string  `json:"diet_plan_content"`
		PhotosJson           string  `json:"photos_json"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "فرمت داده‌های ارسالی نامعتبر است",
		})
	}

	var order models.PlanOrder
	if err := database.DB.First(&order, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "پرونده برنامه یافت نشد",
		})
	}

	if input.Status != "" {
		order.Status = input.Status
	}
	if input.AdminFeedback != "" {
		order.AdminFeedback = input.AdminFeedback
	}
	if input.WorkoutPlanFile != "" {
		order.WorkoutPlanFile = input.WorkoutPlanFile
	}
	if input.DietPlanFile != "" {
		order.DietPlanFile = input.DietPlanFile
	}
	if input.WorkoutPlanContent != "" {
		order.WorkoutPlanContent = input.WorkoutPlanContent
	}
	if input.DietPlanContent != "" {
		order.DietPlanContent = input.DietPlanContent
	}
	if input.PhotosJson != "" {
		order.PhotosJson = input.PhotosJson
	}
	if input.EstimatedDelivery != "" {
		order.EstimatedDelivery = input.EstimatedDelivery
	}
	if input.Age > 0 {
		order.Age = input.Age
	}
	if input.Gender != "" {
		order.Gender = input.Gender
	}
	if input.Height > 0 {
		order.Height = input.Height
	}
	if input.Weight > 0 {
		order.Weight = input.Weight
	}
	if input.ActivityLevel != "" {
		order.ActivityLevel = input.ActivityLevel
	}
	if input.PrimaryGoal != "" {
		order.PrimaryGoal = input.PrimaryGoal
	}
	if input.TrainingLocation != "" {
		order.TrainingLocation = input.TrainingLocation
	}
	if input.ExperienceLevel != "" {
		order.ExperienceLevel = input.ExperienceLevel
	}
	if input.DaysPerWeek != "" {
		order.DaysPerWeek = input.DaysPerWeek
	}
	if input.Injuries != "" {
		order.Injuries = input.Injuries
	}
	if input.DietaryRestrictions != "" {
		order.DietaryRestrictions = input.DietaryRestrictions
	}
	if input.DailyMealsCount != "" {
		order.DailyMealsCount = input.DailyMealsCount
	}
	if input.CoachNotes != "" {
		order.CoachNotes = input.CoachNotes
	}
	order.UpdatedAt = time.Now()

	database.DB.Save(&order)

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "اطلاعات پرونده برنامه با موفقیت به‌روزرسانی شد",
		"order":   order,
	})
}

func DeletePlanOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := database.DB.Delete(&models.PlanOrder{}, id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "خطا در حذف پرونده برنامه",
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "پرونده برنامه با موفقیت حذف شد",
	})
}
