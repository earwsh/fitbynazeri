package database

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"strings"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("nazeri_fitness.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established successfully")

	// Auto-migrate tables
	err = DB.AutoMigrate(
		&models.User{}, 
		&models.BlogCategory{},
		&models.BlogPost{},
		&models.BlogComment{},
		&models.Testimonial{},
		&models.StudentProfile{},
		&models.SiteSEO{}, 
		&models.HeroSlide{}, 
		&models.AboutSection{}, 
		&models.ConsultationRequest{}, 
		&models.MediaFile{},
		&models.PlanOrder{},
		&models.PlanPackage{},
	)
	if err != nil {
		log.Fatalf("Database Migration Failed: %v", err)
	}

	// Seed Initial Data
	seedData()
	seedPlanPackages()

	// Sync physical uploads directory with DB table
	syncUploadsFolder()
}

// seedPlanPackages سه پکیج پیش‌فرض را فقط یک‌بار (وقتی جدول خالی است) ثبت می‌کند
func seedPlanPackages() {
	var count int64
	DB.Model(&models.PlanPackage{}).Count(&count)
	if count > 0 {
		return
	}
	feat := func(f ...string) string { b, _ := json.Marshal(f); return string(b) }
	pkgs := []models.PlanPackage{
		{
			Slug: "workout", Title: "برنامه تمرینی اختصاصی", Subtitle: "طراحی سیستم تمرینی بر اساس تجهیزات و هدف شما",
			Kind: "workout", DurationMonths: 1, Price: 950000, Badge: "تخصصی تمرین", BtnText: "انتخاب برنامه تمرینی", IsActive: true, SortOrder: 1,
			Features: feat("طراحی اختصاصی برای باشگاه یا تمرین در منزل", "تقسیم‌بندی عضلانی (Split) بر مبنای توان ریکاوری شما", "تنظیم دقیق ست‌ها، تکرارها، RPE و زمان‌های استراحت", "راهنمای ویدیویی و متنی اجرای صحیح حرکات ورزشی", "پشتیبانی مستقیم و امکان رفع ابهامات تمرینی", "یک‌بار بازبینی و اصلاح حرکات بر اساس بازخورد هفته اول"),
		},
		{
			Slug: "diet", Title: "برنامه غذایی و رژیم علمی", Subtitle: "تغذیه اصولی متناسب با سفره ایرانی و هدف وزنی",
			Kind: "diet", DurationMonths: 1, Price: 950000, Badge: "تغذیه و متابولیسم", BtnText: "انتخاب برنامه غذایی", IsActive: true, SortOrder: 2,
			Features: feat("محاسبه علمی کالری، پروتئین، کربوهیدرات و چربی", "منعطف و کاملاً بدون گرسنگی یا حذف وعده‌های اصلی", "جدول جایگزینی جامع غذاها برای تنوع روزانه", "برنامه مکمل‌های مجاز و مصرف بهینه (در صورت تمایل)", "پشتیبانی هفتگی و کنترل روند وزن و سایز", "دستورالعمل کنترل اشتهای کاذب و پیشگیری از استپ وزنی"),
		},
		{
			Slug: "combo", Title: "برنامه تمرینی + رژیم غذایی (VIP)", Subtitle: "جامع‌ترین پکیج تحول کامل فیزیک بدنی با بالاترین راندمان",
			Kind: "combo", DurationMonths: 1, Price: 1590000, OldPrice: 1900000, Badge: "پیشنهاد ویژه و پرطرفدار", Popular: true, BtnText: "دریافت پکیج جامع تمرین + تغذیه", IsActive: true, SortOrder: 3,
			Features: feat("شامل تمامی امکانات برنامه تمرینی و برنامه غذایی به طور همزمان", "همگام‌سازی زمان‌بندی تغذیه پیرامون ساعات تمرین (Nutrient Timing)", "آنالیز هفتگی تغییرات سایز، وزن و عکس‌های ارسالی", "پشتیبانی مستقیم اولویت‌دار با مربی ارشد", "تنظیم برنامه مکمل‌ها متناسب با فاز کات یا حجم", "صرفه‌جویی مالی قابل توجه نسبت به دریافت تکی برنامه‌ها"),
		},
	}
	DB.Create(&pkgs)
}

func syncUploadsFolder() {
	files, err := ioutil.ReadDir("./uploads")
	if err != nil {
		return
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		var count int64
		fileName := file.Name()
		fileURL := fmt.Sprintf("https://fitbynazeri.com/uploads/%s", fileName)
		DB.Model(&models.MediaFile{}).Where("file_url = ?", fileURL).Count(&count)

		if count == 0 {
			ext := strings.ToLower(filepath.Ext(fileName))
			fileType := "document"
			if ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".webp" || ext == ".gif" {
				fileType = "image"
			} else if ext == ".mp4" || ext == ".webm" || ext == ".mov" {
				fileType = "video"
			}

			mediaFile := models.MediaFile{
				FileName:  fileName,
				AltText:   strings.ReplaceAll(strings.TrimSuffix(fileName, ext), "_", " "),
				FileURL:   fileURL,
				FileType:  fileType,
				MimeType:  "image/jpeg",
				FileSize:  file.Size(),
				CreatedAt: file.ModTime(),
			}
			DB.Create(&mediaFile)
			log.Printf("Synced existing upload to database: %s\n", fileName)
		}
	}
}

func seedData() {
	// 1. Seed Users
	var superAdmin models.User
	if err := DB.Where("role = ?", models.RoleSuperAdmin).First(&superAdmin).Error; err != nil {
		superPass, _ := bcrypt.GenerateFromPassword([]byte("super123456"), bcrypt.DefaultCost)
		super := models.User{
			FullName: "آرش ناظری (سوپروایزر و مدیر فنی سایت)",
			Email:    "supervisor@nazeri.fit",
			Phone:    "09121111111",
			Password: string(superPass),
			Role:     models.RoleSuperAdmin,
			IsActive: true,
		}
		DB.Create(&super)
	}

	var coachAdmin models.User
	if err := DB.Where("role = ?", models.RoleAdmin).First(&coachAdmin).Error; err != nil {
		coachPass, _ := bcrypt.GenerateFromPassword([]byte("admin123456"), bcrypt.DefaultCost)
		coach := models.User{
			FullName: "احسان ناظری (مربی ارشد)",
			Email:    "admin@nazeri.fit",
			Phone:    "09120000000",
			Password: string(coachPass),
			Role:     models.RoleAdmin,
			IsActive: true,
		}
		DB.Create(&coach)
	}

	var studentUser models.User
	if err := DB.Where("role = ?", models.RoleStudent).First(&studentUser).Error; err != nil {
		studentPass, _ := bcrypt.GenerateFromPassword([]byte("user123456"), bcrypt.DefaultCost)
		student := models.User{
			FullName: "علی رضایی (قهرمان نمونه)",
			Email:    "student@nazeri.fit",
			Phone:    "09350000000",
			Password: string(studentPass),
			Role:     models.RoleStudent,
			IsActive: true,
		}
		DB.Create(&student)
	}

	// 2. Seed Default Site SEO Config
	var seoCount int64
	DB.Model(&models.SiteSEO{}).Count(&seoCount)
	if seoCount == 0 {
		defaultSEO := models.SiteSEO{
			MetaTitle:    "آکادمی مربیگری و بدنسازی ناظری | دریافت برنامه تمرینی و غذایی آنلاین",
			MetaDesc:     "طراحی علمی برنامه‌های بدنسازی، فیتنس و تغذیه اختصاصی همراه با مربیگری و پشتیبانی هفتگی توسط احسان ناظری",
			Keywords:     "برنامه بدنسازی, مربی آنلاین, رژیم غذایی فیتنس, لاغری و عضله سازی, احسان ناظری",
			CanonicalURL: "https://nazeri.fit",
			RobotsIndex:  true,
			SchemaJson:   `{"@context":"https://schema.org","@type":"SportsClub","name":"Nazeri Fitness Academy"}`,
		}
		DB.Create(&defaultSEO)
	}

	// 3. Seed Default Hero Slides
	var heroCount int64
	DB.Model(&models.HeroSlide{}).Count(&heroCount)
	if heroCount == 0 {
		slides := []models.HeroSlide{
			{
				OrderIndex:     1,
				TitlePrefix:    "تغییر ماندگار اندام شما، با",
				TitleHighlight: "دقت علمی و هوش مصنوعی",
				Description:    "دیگر نیازی به رژیم‌های سخت و تمرینات خسته‌کننده غیراصولی نیست. در آکادمی ناظری، برنامه‌های تمرینی و غذایی شما بر اساس ژنتیک، اهداف و سبک زندگی روزمره‌تان طراحی می‌شود.",
				PrimaryBtnText: "دریافت برنامه اختصاصی",
				PrimaryBtnHref: "#packages",
				SecondaryBtnText: "مشاهده نتایج قهرمانان",
				SecondaryBtnHref: "#transformations",
				ImageURL:       "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop",
				IsActive:       true,
			},
			{
				OrderIndex:     2,
				TitlePrefix:    "طراحی هوشمند رژیم غذایی و",
				TitleHighlight: "برنامه تمرینی اختصاصی",
				Description:    "با تلفیق فیزیولوژی ورزشی و سیستم هوش مصنوعی اختصاصی، کالری‌ها و درشت‌مغذی‌های شما دقیقاً بر اساس ترجیحات غذایی روزمره‌تان محاسبه و تنظیم می‌گردد.",
				PrimaryBtnText: "شروع آنالیز هوشمند هدف",
				PrimaryBtnHref: "#ai-planner",
				SecondaryBtnText: "محاسبه آنلاین BMI",
				SecondaryBtnHref: "#calculator",
				ImageURL:       "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1920&auto=format&fit=crop",
				IsActive:       true,
			},
			{
				OrderIndex:     3,
				TitlePrefix:    "پشتیبانی و آنالیز هفتگی با",
				TitleHighlight: "استاد احسان ناظری",
				Description:    "هر هفته پیشرفت شما با ارسال عکس، اندازه‌گیری سایزها و بررسی نمودارهای بدنی تحلیل شده و برنامه متناسب با تغییرات بدنتان به‌روزرسانی می‌شود.",
				PrimaryBtnText: "مشاوره و ثبت‌نام VIP",
				PrimaryBtnHref: "#packages",
				SecondaryBtnText: "درباره سوابق مربی",
				SecondaryBtnHref: "#about",
				ImageURL:       "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop",
				IsActive:       true,
			},
		}
		for _, s := range slides {
			DB.Create(&s)
		}
	}

	// 4. Seed Default About Section CMS
	var aboutCount int64
	DB.Model(&models.AboutSection{}).Count(&aboutCount)
	if aboutCount == 0 {
		defaultAbout := models.AboutSection{
			TitlePrefix:    "درباره مربی و",
			TitleHighlight: "آکادمی ناظری",
			Paragraph1:     "آکادمی فیتنس و بدنسازی ناظری با هدایت استاد احسان ناظری، متدی نوین و متکی بر دانش روز دنیا را در عرصه تناسب اندام و مربیگری حرفه‌ای ارائه می‌دهد. باور بنیادین ما این است که بدن هر فرد یک ساختار فیزیولوژیکی و ژنتیکی کاملاً منحصربه‌فرد دارد؛ از این رو رویکردهای سنتی، کپی‌برداری از برنامه‌های عمومی و اعمال رژیم‌های طاقت‌فرسا نه تنها به نتیجه پایدار ختم نمی‌شوند، بلکه فرسودگی مفاصل و آسیب‌های جبران‌ناپذیر عضلانی را به همراه دارند.",
			Paragraph2:     "در این مجموعه، برنامه‌های تمرینی بر پایه دقیق‌ترین اصول بیومکانیک حرکتی، تحریک هایپرتروفی و ارتقای توان متابولیکی تنظیم می‌گردند. رژیم‌های غذایی ارائه‌شده نیز با حفظ احترام به سفره خانواده ایرانی و ترجیحات غذایی روزمره قهرمان تدوین شده تا بدون گرسنگی مفرط و افت انرژی، کاهش چربی اصولی و فرم‌گیری عضلات محقق شود. نظارت هفتگی و به‌روزرسانی مستمر روند پیشرفت، تضمین‌کننده دستیابی شما به اندامی ماندگار و سالم خواهد بود.",
			CoachName:      "استاد احسان ناظری",
			CoachRole:      "مربی ارشد فدراسیون پرورش اندام",
			ExperienceBadge: "+۸ سال سابقه",
			CoachImageURL:  "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop",
			Card1Title:     "مدرک بین‌المللی مربیگری IFBB",
			Card1Desc:      "دارای گواهینامه رسمی مربیگری حرفه‌ای بدنسازی و پرورش اندام",
			Card2Title:     "کارشناس ارشد فیزیولوژی ورزشی",
			Card2Desc:      "طراحی برنامه‌های تمرینی بر پایه علم بیومکانیک و هایپرتروفی عضلانی",
			Card3Title:     "بیش از ۱,۲۰۰ قهرمان موفق",
			Card3Desc:      "ثبت تغییرات ماندگار و نتایج واقعی در قهرمانان سراسر کشور",
			Card4Title:     "متخصص تغذیه و متابولیسم",
			Card4Desc:      "تنظیم رژیم‌های بدون گرسنگی متناسب با سفره غذایی و متابولیسم",
			BtnText:        "مشاهده پکیج‌ها و شروع مربیگری",
			BtnHref:        "#packages",
		}
		DB.Create(&defaultAbout)
	}

	// 5. Seed Samples of Consultation Requests
	var consultCount int64
	DB.Model(&models.ConsultationRequest{}).Count(&consultCount)
	if consultCount == 0 {
		samples := []models.ConsultationRequest{
			{
				FullName:  "امیرحسین کاظمی",
				Phone:     "09123456789",
				Topic:     "مشاوره انتخاب پکیج مناسب",
				Status:    "pending",
			},
			{
				FullName:  "سارا سلیمانی",
				Phone:     "09359876543",
				Topic:     "بررسی آسیب‌دیدگی‌های بدنی قبل از ثبت‌نام",
				Status:    "contacted",
				Notes:     "مشکل دیسک کمر خفیف دارد. پکیج اصلاحی پیشنهاد شد.",
			},
		}
		for _, req := range samples {
			DB.Create(&req)
		}
	}

	// 6. Seed Initial Blog Categories
	var catCount int64
	DB.Model(&models.BlogCategory{}).Count(&catCount)
	if catCount == 0 {
		categories := []models.BlogCategory{
			{
				Slug:        "training-science",
				Name:        "علم تمرین و فیزیولوژی",
				Description: "تحلیل اصول بیومکانیک، هایپرتروفی و متدهای نوین تمرینات قدرتی",
			},
			{
				Slug:        "nutrition-metabolism",
				Name:        "تغذیه و متابولیسم",
				Description: "راهنماهای علمی چربی‌سوزی، رژیم‌های هایپرتروفی و تنظیم درشت‌مغذی‌ها",
			},
			{
				Slug:        "workout-programming",
				Name:        "برنامه‌نویسی تمرین",
				Description: "اصول طراحی اسپلیت‌های تمرینی، اضافه بار تدریجی و ریکاوری",
			},
			{
				Slug:        "supplements-health",
				Name:        "مکمل‌ها و سلامت ورزشی",
				Description: "بررسی علمی مکمل‌های ورزشی، سلامت مفاصل و بهینه‌سازی هورمونی",
			},
		}
		for _, cat := range categories {
			DB.Create(&cat)
		}
	}

	// 7. Seed Initial Students Profiles
	var studentCount int64
	DB.Model(&models.StudentProfile{}).Count(&studentCount)
	if studentCount == 0 {
		students := []models.StudentProfile{
			{
				Slug:          "amir-reza-shams",
				FullName:      "امیررضا شمس",
				Phone:         "09124445566",
				Email:         "shams@gmail.com",
				Category:      "فیزیک کلاسیک - مسابقات کشوری",
				PackageName:   "پکیج جامع VIP + آمادگی استیج",
				Duration:      "۱۴ ماه تمرین تخصصی",
				ImageURL:      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
				InitialWeight: 98.0,
				CurrentWeight: 80.0,
				TargetWeight:  78.5,
				Height:        182,
				Age:           26,
				BodyFat:       6.2,
				Medals:        "مدال طلای مسابقات کشوری فیزیک کلاسیک ۱۴۰۴ | مدال نقره اورال استان تهران",
				Bio:           "کاهش ۱۸ کیلوگرم بافت چربی و افزایش ۶.۵ کیلوگرم هایپرتروفی خالص در طول دوره آمادگی مسابقات.",
				CoachNotes:    "فرم بدنی عالی، پاسخ‌دهی بالا به رژیم کربوهیدرات چرخشی. آمادگی کامل برای مسابقات بین‌المللی.",
				Status:        "active",
				IsChampion:    true,
			},
			{
				Slug:          "mahyar-taheri",
				FullName:      "مهیار طاهری",
				Phone:         "09127778899",
				Email:         "mahyar.t@yahoo.com",
				Category:      "بادی بیلدینگ - دسته ۸۵ کیلوگرم",
				PackageName:   "پکیج تخصصی عضله‌سازی و استیج",
				Duration:      "۱۸ ماه آمادگی استیج",
				ImageURL:      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
				InitialWeight: 77.0,
				CurrentWeight: 85.0,
				TargetWeight:  85.0,
				Height:        176,
				Age:           29,
				BodyFat:       5.8,
				Medals:        "مدال طلای پرورش اندام شمال کشور | مدال برنز انتخابی تیم ملی",
				Bio:           "افزایش ۸ کیلوگرم حجم خشک عضلانی با رعایت دقیق رژیم هایپرتروفی و بیومکانیک تمرینی.",
				CoachNotes:    "عضلات زیربغل و همسترینگ نقطه قوت. کات فوق‌العاده در ناحیه میان‌تنه.",
				Status:        "active",
				IsChampion:    true,
			},
			{
				Slug:          "hossein-bagheri",
				FullName:      "حسین باقری",
				Phone:         "09361112233",
				Email:         "h.bagheri@gmail.com",
				Category:      "فیزیک و ماسکولار فیزیک",
				PackageName:   "دوره فیتنس و اصلاح فیزیک VIP",
				Duration:      "۱۰ ماه دوره فیتنس VIP",
				ImageURL:      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
				InitialWeight: 92.0,
				CurrentWeight: 80.0,
				TargetWeight:  79.0,
				Height:        178,
				Age:           24,
				BodyFat:       7.5,
				Medals:        "نفر اول دسته قدی ۱۷۸ سانتی‌متر مسابقات پایتخت",
				Bio:           "کاهش ۱۲ کیلوگرم چربی زائد و کات عمقی شکم و پهلو همراه با بهبود چشمگیر تناسب اندام.",
				CoachNotes:    "پیشرفت مستمر در اسکوات و ددلیفت. انگیزه بسیار بالا در جلسات هفتگی.",
				Status:        "active",
				IsChampion:    true,
			},
		}
		for _, st := range students {
			DB.Create(&st)
		}
	}

	// 8. Seed Initial Testimonials
	var testiCount int64
	DB.Model(&models.Testimonial{}).Count(&testiCount)
	if testiCount == 0 {
		initialReviews := []models.Testimonial{
			{
				FullName:  "علیرضا معتمدی",
				RoleTitle: "قهرمان دوره VIP کاهش وزن",
				Course:    "پکیج جامع VIP + رژیم منعطف",
				Avatar:    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
				Rating:    5,
				Result:    "کاهش ۱۶ کیلوگرم چربی در ۴ ماه",
				Comment:   "بعد از سال‌ها رژیم‌های سخت و خسته‌کننده، با برنامه استاد ناظری بدون هیچ گرسنگی ۱۶ کیلوگرم در ۴ ماه کم کردم. مهم‌ترین نکته، آنالیز هفتگی دقیق و پشتیبانی بی‌نظیرشون بود.",
				Status:    "approved",
			},
			{
				FullName:  "سارا ابراهیمی",
				RoleTitle: "قهرمان دوره فرم‌دهی بانوان",
				Course:    "پکیج ۶ ماهه فیتنس بانوان",
				Avatar:    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
				Rating:    5,
				Result:    "افزایش حجم خالص و فرم‌دهی کامل",
				Comment:   "بهترین تجربه‌ای که از مربیگری آنلاین داشتم. برنامه‌ها کاملاً متناسب با ساختار بدنی و وسایل باشگاه من چیده شده بود و فرم‌گیری عضلاتم بعد از ۲ ماه فوق‌العاده محسوس شد.",
				Status:    "approved",
			},
			{
				FullName:  "پویا کریمی",
				RoleTitle: "قهرمان دوره مسابقات",
				Course:    "دوره اختصاصی آمادگی مسابقات",
				Avatar:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
				Rating:    5,
				Result:    "کسب مدال طلای فیزیک استانی",
				Comment:   "علم تمرین و بیومکانیک استاد ناظری در سطح جهانیه. تمام آسیب‌های قدیمی کتف و زانوی من در حین تمرین اصلاح شد و با بهترین آمادگی روی استیج مسابقات رفتم.",
				Status:    "approved",
			},
		}
		for _, rev := range initialReviews {
			DB.Create(&rev)
		}
	}

	// 9. Seed Initial Blog Articles
	var blogCount int64
	DB.Model(&models.BlogPost{}).Count(&blogCount)
	if blogCount == 0 {
		articles := []models.BlogPost{
			{
				Slug:        "hypertrophy-science-biomechanics",
				Title:       "اصول علمی هایپرتروفی: چگونه بدون آسیب بیشترین عضله‌سازی را داشته باشیم؟",
				Excerpt:     "بررسی فاکتورهای تنش مکانیکی، استرس متابولیک و آسیب عضلانی به همراه راهنمای انتخاب دامنه تکرار مناسب برای رشد حداکثری عضلات.",
				Category:    "علم تمرین و فیزیولوژی",
				ReadTime:    "۶ دقیقه مطالعه",
				ImageURL:    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
				AuthorName:  "استاد احسان ناظری",
				AuthorRole:  "مربی ارشد بدنسازی",
				Tags:        "هایپرتروفی, بیومکانیک, تمرینات قدرتی, رشد عضلات",
				IsPublished: true,
				Content: `<h2>مقدمه‌ای بر فیزیولوژی هایپرتروفی عضلانی</h2>
<p>رشد عضلانی یا <strong>هایپرتروفی (Hypertrophy)</strong> نتیجه سازگاری فیزیولوژیکی بافت عضلانی در پاسخ به اضافه بار مکانیکی مستمر است. در دهه‌های گذشته باور بر این بود که تنها بلند کردن وزنه‌های فوق‌سنگین باعث رشد عضله می‌شود، اما تحقیقات نوین نشان می‌دهد که کیفیت اجرای حرکت، کنترل فاز منفی (Eccentric) و ایجاد تنش مکانیکی در تمام دامنه حرکتی، اهمیت به مراتب بالاتری دارند.</p>
<h3>۳ فاکتور کلیدی در تحریک سنتز پروتئین عضلانی:</h3>
<ol>
<li><strong>تنش مکانیکی (Mechanical Tension):</strong> اعمال فشار کششی و انقباضی روی تارهای عضلانی در حین غلبه بر مقاومت وزنه.</li>
<li><strong>استرس متابولیک (Metabolic Stress):</strong> تجمع متابولیت‌هایی نظیر لاکتات و یون‌های هیدروژن در سلول عضلانی ناشی از گلیکولیز بی‌هوازی (پمپ عضلانی).</li>
<li><strong>آسیب میکروسکوپی هدفمند (Muscle Microtrauma):</strong> پارگی‌های ریز در سارکومرها که با ریکاوری و تغذیه پروتئینی مناسب به تارهای قطورتر تبدیل می‌شوند.</li>
</ol>
<hr/>
<h3>راهنمای عملی برای تنظیم ست‌ها و تکرارها</h3>
<ul>
<li>در حرکات چندمفصلی (اسکوات، پرس سینه، زیربغل هالتر) از دامنه ۶ الی ۱۰ تکرار با استراحت ۹۰ تا ۱۲۰ ثانیه استفاده کنید.</li>
<li>در حرکات تک‌مفصلی و ایزوله (نشر از جانب، جلو بازو لاری، پشت پا خوابیده) دامنه ۱۰ الی ۱۵ تکرار با تمرکز بر انقباض ایزومتریک اوج را مدنظر قرار دهید.</li>
<li>هر ست را در فاصله ۱ تا ۲ تکرار مانده به ناتوانی کامل (RPE 8-9) به پایان برسانید.</li>
</ul>`,
			},
			{
				Slug:        "fat-loss-without-muscle-loss",
				Title:       "چربی‌سوزی پایدار بدون افت عضلانی: راهنمای گام‌به‌گام کات اصولی",
				Excerpt:     "تنظیم شیب کالری، میزان پروتئین دریافتی روزانه و زمان‌بندی درشت‌مغذی‌ها بدون احساس گرسنگی و افت انرژی در طول روزمره.",
				Category:    "تغذیه و متابولیسم",
				ReadTime:    "۸ دقیقه مطالعه",
				ImageURL:    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
				AuthorName:  "استاد احسان ناظری",
				AuthorRole:  "متخصص تغذیه و متابولیسم ورزشی",
				Tags:        "چربی سوزی, کات عضلانی, رژیم بدون گرسنگی, درشت مغذی",
				IsPublished: true,
				Content: `<h2>چگونه بدون تحلیل رفتن عضلات، چربی‌های لجباز را بسوزانیم؟</h2>
<p>بزرگ‌ترین خطایی که اکثر ورزشکاران در فاز کاهش وزن مرتکب می‌شوند، افت ناگهانی و شدید کالری دریافتی است. این رویکرد سنتی باعث افت ترشح هورمون‌های تیروئیدی، کاهش سرعت متابولیسم پایه (BMR) و تجزیه بافت ارزشمند پروتئینی به عنوان سوخت اضطراری می‌شود.</p>
<h3>اصول ۴ گانه رژیم کات علمی در آکادمی ناظری:</h3>
<ol>
<li><strong>کسری کالری متعادل (Moderate Deficit):</strong> کسری روزانه ۳۰۰ تا ۵۰۰ کالری نسبت به سطح نگهداری (TDEE).</li>
<li><strong>افزایش پروتئین به ۱.۸ تا ۲.۲ گرم به ازای هر کیلوگرم وزن بدن:</strong> برای ایجاد سیری مداوم و حفظ اثر گرمازایی غذا (TEF).</li>
<li><strong>چرخش کربوهیدرات (Carb Cycling):</strong> افزایش مصرف کربوهیدرات در روزهای تمرینات پرفشار عضلات بزرگ و کاهش آن در روزهای استراحت.</li>
<li><strong>هیدراتاسیون و خواب عمیق:</strong> نوشیدن حداقل ۳ تا ۴ لیتر آب و خواب باکیفیت برای کنترل سطح هورمون کورتیزول.</li>
</ol>`,
			},
			{
				Slug:        "progressive-overload-rules",
				Title:       "قانون اضافه بار تدریجی (Progressive Overload): کلید عبور از فلات تمرینی",
				Excerpt:     "چرا افزایش وزنه تنها راه پیشرفت نیست؟ ۷ روش علمی برای پیشرفت مستمر در بدنسازی بدون گیر افتادن در رکود و فلات عضلانی.",
				Category:    "برنامه‌نویسی تمرین",
				ReadTime:    "۵ دقیقه مطالعه",
				ImageURL:    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
				AuthorName:  "استاد احسان ناظری",
				AuthorRole:  "مربی ارشد بدنسازی",
				Tags:        "اضافه بار تدریجی, پیشرفت تمرینی, بدنسازی علمی, سیستم تمرین",
				IsPublished: true,
				Content: `<h2>عبور از استپ عضلانی با اصل اضافه بار تدریجی</h2>
<p>عضله تا زمانی رشد می‌کند که دلیل فیزیولوژیکی جدیدی برای رشد داشته باشد! اگر برای ماه‌ها با همان وزنه‌ها، همان ست‌ها و همان زمان استراحت تمرین کنید، بدنتان به شرایط پایدار رسیده و متوقف می‌شود.</p>
<h3>۷ روش پیشرفته برای ایجاد Progressive Overload:</h3>
<ol>
<li><strong>افزایش مقدار وزنه (Load Progression):</strong> اضافه کردن ۱ تا ۲ کیلوگرم به هالتر در هر ۲ هفته.</li>
<li><strong>افزایش تعداد تکرار در وزنه ثابت:</strong> رساندن تکرار ۸ به ۱۱ با همان وزنه قبلی.</li>
<li><strong>افزایش تعداد ست‌ها (Volume):</strong> افزودن ۱ ست به عضلات دارای تاخیر رشدی.</li>
<li><strong>افزایش زمان تحت تنش (Time Under Tension - TUT):</strong> آهسته‌تر کردن فاز منفی حرکت به ۳ تا ۴ ثانیه.</li>
<li><strong>بهبود فرم و عمق حرکت:</strong> افزایش دامنه حرکتی با حفظ ثبات مفاصل.</li>
<li><strong>کاهش زمان استراحت بین ست‌ها:</strong> وادار کردن سیستم عضلانی به بازیابی سریع‌تر انرژی.</li>
<li><strong>افزایش فرکانس تمرینی در هفته:</strong> تمرین دادن هر عضله ۲ بار در هفته به جای ۱ بار سنتی.</li>
</ol>`,
			},
		}
		for _, art := range articles {
			DB.Create(&art)
		}
		log.Println("Default Blog Articles seeded successfully")
	}
}
