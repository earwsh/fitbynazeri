package models

import (
	"time"
	"gorm.io/gorm"
)

type Role string

const (
	RoleSuperAdmin Role = "superadmin" // سوپروایزر / ادمین فنی و سئو
	RoleAdmin      Role = "admin"      // مربی ارشد بدنسازی
	RoleStudent    Role = "student"    // قهرمان و کاربر عادی
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	FullName  string         `gorm:"size:100;not null" json:"full_name"`
	Email     string         `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Phone     string         `gorm:"size:20;uniqueIndex" json:"phone"`
	Password  string         `gorm:"not null" json:"-"`
	Role      Role           `gorm:"size:20;default:'student';not null" json:"role"`
	Avatar    string         `gorm:"size:255" json:"avatar"`
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// مدل دسته‌بندی مقالات وبلاگ (Blog Category Model)
type BlogCategory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Slug        string    `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Description string    `gorm:"size:255" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// مدل مقالات وبلاگ تخصصی (Blog Post Model)
type BlogPost struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Slug        string    `gorm:"size:150;uniqueIndex;not null" json:"slug"`
	Title       string    `gorm:"size:255;not null" json:"title"`
	Excerpt     string    `gorm:"size:500;not null" json:"excerpt"`
	Content     string    `gorm:"type:text;not null" json:"content"`
	Category    string    `gorm:"size:100;not null" json:"category"`
	AuthorName  string    `gorm:"size:100;default:'استاد احسان ناظری'" json:"author_name"`
	AuthorRole  string    `gorm:"size:100;default:'مربی ارشد بدنسازی'" json:"author_role"`
	ReadTime    string    `gorm:"size:50;default:'۵ دقیقه'" json:"read_time"`
	ImageURL    string    `gorm:"size:500;not null" json:"image_url"`
	Tags        string    `gorm:"size:255" json:"tags"` // با کاما جدا شوند
	ImageAlt        string `gorm:"size:255" json:"image_alt"`
	MetaTitle       string `gorm:"size:255" json:"meta_title"`
	MetaDescription string `gorm:"size:500" json:"meta_description"`
	FocusKeyword    string `gorm:"size:100" json:"focus_keyword"`
	FaqTitle        string `gorm:"size:255" json:"faq_title"`
	FaqItems        string `gorm:"type:text" json:"faq_items"` // آرایه JSON از {question, answer}
	IsPublished bool      `gorm:"default:true" json:"is_published"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// مدل دیدگاه‌ها و نظرات قهرمانان (Testimonials / Reviews)
type Testimonial struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FullName  string    `gorm:"size:100;not null" json:"full_name"`
	RoleTitle string    `gorm:"size:100" json:"role_title"` // مثلا: قهرمان دوره VIP کاهش وزن
	Course    string    `gorm:"size:150" json:"course"`     // پکیج یا دوره
	Avatar    string    `gorm:"size:500" json:"avatar"`
	Rating    int       `gorm:"default:5" json:"rating"`
	Result    string    `gorm:"size:255" json:"result"`     // نتیجه شاخص مثلا: کاهش ۱۶ کیلوگرم در ۴ ماه
	Comment   string    `gorm:"type:text;not null" json:"comment"`
	Status    string    `gorm:"size:50;default:'pending'" json:"status"` // pending (در انتظار تایید), approved (تایید شده برای نمایش), rejected
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// مدل پروفایل و پرونده ورزشی قهرمان (Student Profile)
type StudentProfile struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Slug           string    `gorm:"size:100;uniqueIndex;not null" json:"slug"` // اسلاگ جهت آدرس صفحه اختصاصی (مثل: amir-shams)
	FullName       string    `gorm:"size:100;not null" json:"full_name"`
	Phone          string    `gorm:"size:20" json:"phone"`
	Email          string    `gorm:"size:100" json:"email"`
	Category       string    `gorm:"size:100" json:"category"` // مثل: فیزیک کلاسیک، کاهش وزن، عضله‌سازی
	PackageName    string    `gorm:"size:100" json:"package_name"` // پکیج ثبت‌نامی
	Duration       string    `gorm:"size:100" json:"duration"` // سابقه دوره (مثلا: ۱۴ ماه)
	ImageURL       string    `gorm:"size:500" json:"image_url"`
	InitialWeight  float64   `json:"initial_weight"` // وزن اولیه (کیلوگرم)
	CurrentWeight  float64   `json:"current_weight"` // وزن فعلی
	TargetWeight   float64   `json:"target_weight"`  // وزن هدف
	Height         int       `json:"height"`         // قد (سانتی‌متر)
	Age            int       `json:"age"`            // سن
	BodyFat        float64   `json:"body_fat"`       // درصد چربی
	Medals         string    `gorm:"type:text" json:"medals"` // مدال‌ها و افتخارات به صورت متن یا JSON
	Bio            string    `gorm:"type:text" json:"bio"`    // توضیحات و پرونده مربیگری
	CoachNotes     string    `gorm:"type:text" json:"coach_notes"` // یادداشت‌های محرمانه مربی
	Status         string    `gorm:"size:50;default:'active'" json:"status"` // active, completed, paused
	IsChampion     bool      `gorm:"default:false" json:"is_champion"` // آیا در سکشن قهرمانان صفحه اصلی نمایش داده شود؟
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// مدل تنظیمات سئو و متاتگ‌های سایت
type SiteSEO struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	MetaTitle      string    `gorm:"size:255" json:"meta_title"`
	MetaDesc       string    `gorm:"size:500" json:"meta_desc"`
	Keywords       string    `gorm:"size:500" json:"keywords"`
	CanonicalURL   string    `gorm:"size:255" json:"canonical_url"`
	RobotsIndex    bool      `gorm:"default:true" json:"robots_index"`
	SchemaJson     string    `gorm:"type:text" json:"schema_json"`
	GoogleAnalyticsID string `gorm:"size:50" json:"google_analytics_id"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// مدل اسلایدهای هیروسکشن (Hero Slides CMS)
type HeroSlide struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	OrderIndex     int       `gorm:"default:0" json:"order_index"`
	TitlePrefix    string    `gorm:"size:255;not null" json:"title_prefix"`
	TitleHighlight string    `gorm:"size:255;not null" json:"title_highlight"`
	Description    string    `gorm:"type:text;not null" json:"description"`
	PrimaryBtnText string    `gorm:"size:100" json:"primary_btn_text"`
	PrimaryBtnHref string    `gorm:"size:255" json:"primary_btn_href"`
	SecondaryBtnText string  `gorm:"size:100" json:"secondary_btn_text"`
	SecondaryBtnHref string  `gorm:"size:255" json:"secondary_btn_href"`
	ImageURL       string    `gorm:"size:500;not null" json:"image_url"`
	IsActive       bool      `gorm:"default:true" json:"is_active"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// مدل سکشن درباره ما در صفحه اصلی (About Section CMS)
type AboutSection struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	TitlePrefix    string    `gorm:"size:255;not null" json:"title_prefix"`
	TitleHighlight string    `gorm:"size:255;not null" json:"title_highlight"`
	Paragraph1     string    `gorm:"type:text;not null" json:"paragraph1"`
	Paragraph2     string    `gorm:"type:text;not null" json:"paragraph2"`
	CoachName      string    `gorm:"size:100;not null" json:"coach_name"`
	CoachRole      string    `gorm:"size:255;not null" json:"coach_role"`
	ExperienceBadge string   `gorm:"size:100;not null" json:"experience_badge"`
	CoachImageURL  string    `gorm:"size:500;not null" json:"coach_image_url"`
	Card1Title     string    `gorm:"size:255" json:"card1_title"`
	Card1Desc      string    `gorm:"size:255" json:"card1_desc"`
	Card2Title     string    `gorm:"size:255" json:"card2_title"`
	Card2Desc      string    `gorm:"size:255" json:"card2_desc"`
	Card3Title     string    `gorm:"size:255" json:"card3_title"`
	Card3Desc      string    `gorm:"size:255" json:"card3_desc"`
	Card4Title     string    `gorm:"size:255" json:"card4_title"`
	Card4Desc      string    `gorm:"size:255" json:"card4_desc"`
	BtnText        string    `gorm:"size:100" json:"btn_text"`
	BtnHref        string    `gorm:"size:255" json:"btn_href"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// مدل درخواست‌های مشاوره رایگان تلفنی
type ConsultationRequest struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FullName  string    `gorm:"size:100;not null" json:"full_name"`
	Phone     string    `gorm:"size:20;not null" json:"phone"`
	Topic     string    `gorm:"size:255;not null" json:"topic"`
	Status    string    `gorm:"size:50;default:'pending'" json:"status"` // pending, contacted, completed
	Notes     string    `gorm:"size:500" json:"notes"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// مدل رسانه‌ها و فایل‌های آپلود شده
type MediaFile struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	FileName    string    `gorm:"size:255;not null" json:"file_name"`
	AltText     string    `gorm:"size:255" json:"alt_text"`
	Title       string    `gorm:"size:255" json:"title"`
	Caption     string    `gorm:"size:500" json:"caption"`
	FileURL     string    `gorm:"size:500;not null" json:"file_url"`
	FileType    string    `gorm:"size:50" json:"file_type"`
	MimeType    string    `gorm:"size:100" json:"mime_type"`
	FileSize    int64     `json:"file_size"`
	Width       int       `json:"width"`
	Height      int       `json:"height"`
	IsOptimized bool      `gorm:"default:false" json:"is_optimized"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// مدل اختصاصی دیدگاه‌ها و نظرات مقالات وبلاگ (Blog Comment Model)
type BlogComment struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	PostSlug       string     `gorm:"size:150;index;not null" json:"post_slug"` // اسلاگ مقاله مربوطه
	PostTitle      string     `gorm:"size:255" json:"post_title"`               // عنوان مقاله برای نمایش در پنل ادمین
	FullName       string     `gorm:"size:100;not null" json:"full_name"`
	Email          string     `gorm:"size:100" json:"email"`
	Comment        string     `gorm:"type:text;not null" json:"comment"`
	Rating         int        `gorm:"default:5" json:"rating"`
	Status         string     `gorm:"size:50;default:'pending'" json:"status"` // pending (در انتظار تایید), approved (تایید شده), rejected
	Reply          string     `gorm:"type:text" json:"reply"`                  // پاسخ مربی / ادمین
	ReplyAuthor    string     `gorm:"size:100;default:'استاد احسان ناظری'" json:"reply_author"`
	ReplyCreatedAt *time.Time `json:"reply_created_at"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

// پکیج‌های دریافت برنامه که توسط سوپروایزر تعریف می‌شوند
type PlanPackage struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Slug           string    `gorm:"size:50;uniqueIndex;not null" json:"slug"` // workout, diet, combo یا pkg-<id>
	Title          string    `gorm:"size:150;not null" json:"title"`
	Subtitle       string    `gorm:"size:255" json:"subtitle"`
	Kind           string    `gorm:"size:20;not null;default:'combo'" json:"kind"` // workout, diet, combo
	DurationMonths int       `gorm:"not null;default:1" json:"duration_months"`
	Price          int64     `gorm:"not null" json:"price"` // تومان
	OldPrice       int64     `json:"old_price"`
	Badge          string    `gorm:"size:100" json:"badge"`
	Popular        bool      `json:"popular"`
	Features       string    `gorm:"type:text" json:"features"` // آرایه JSON از رشته‌ها
	BtnText        string    `gorm:"size:100" json:"btn_text"`
	IsActive       bool      `gorm:"default:true" json:"is_active"`
	SortOrder      int       `json:"sort_order"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// مدل سفارش‌ها و پرونده‌های دریافت برنامه قهرمان (Plan Order / Intake Model)
type PlanOrder struct {
	PackageSlug         string     `gorm:"size:50;index" json:"package_slug"`
	DurationMonths      int        `json:"duration_months"`
	ID                  uint       `gorm:"primaryKey" json:"id"`
	UserID              uint       `gorm:"index;not null" json:"user_id"`
	UserEmail           string     `gorm:"size:100;index;not null" json:"user_email"`
	UserName            string     `gorm:"size:100;not null" json:"user_name"`
	UserPhone           string     `gorm:"size:20" json:"user_phone"`
	PackageType         string     `gorm:"size:50;not null" json:"package_type"` // workout, diet, combo
	PackageTitle        string     `gorm:"size:100;not null" json:"package_title"`
	Price               string     `gorm:"size:50;not null" json:"price"`
	PaymentStatus       string     `gorm:"size:50;default:'pending'" json:"payment_status"` // pending (در انتظار پرداخت), paid (پرداخت شده)
	Status              string     `gorm:"size:50;default:'reviewing'" json:"status"`       // reviewing (در حال بررسی توسط مربی), preparing (در حال تدوین برنامه), ready (آماده و فعال در داشبورد), completed (پایان دوره)
	Age                 int        `json:"age"`
	Gender              string     `gorm:"size:20" json:"gender"`
	Height              int        `json:"height"`
	Weight              float64    `json:"weight"`
	ActivityLevel       string     `gorm:"size:50" json:"activity_level"`
	PrimaryGoal         string     `gorm:"size:50" json:"primary_goal"`
	TrainingLocation    string     `gorm:"size:50" json:"training_location"`
	ExperienceLevel     string     `gorm:"size:50" json:"experience_level"`
	DaysPerWeek         string     `gorm:"size:20" json:"days_per_week"`
	Injuries            string     `gorm:"size:255" json:"injuries"`
	DietaryRestrictions string    `gorm:"size:255" json:"dietary_restrictions"`
	DailyMealsCount     string     `gorm:"size:20" json:"daily_meals_count"`
	Supplements         string     `gorm:"size:255" json:"supplements"`
	CoachNotes          string     `gorm:"type:text" json:"coach_notes"`
	WorkoutPlanFile     string     `gorm:"size:500" json:"workout_plan_file"` // لینک فایل یا جدول تمرینی آماده شده
	DietPlanFile        string     `gorm:"size:500" json:"diet_plan_file"`    // لینک فایل یا جدول رژیم غذایی
	WorkoutPlanContent  string     `gorm:"type:text" json:"workout_plan_content"` // ساختار متن یا جیسون برنامه تمرینی
	DietPlanContent     string     `gorm:"type:text" json:"diet_plan_content"`    // ساختار متن یا توصیه‌های رژیم غذایی
	PhotosJson          string     `gorm:"type:text" json:"photos_json"`          // تصاویر ارسالی قهرمان
	AdminFeedback       string     `gorm:"type:text" json:"admin_feedback"`   // پیام مربی به قهرمان
	EstimatedDelivery   string     `gorm:"size:100" json:"estimated_delivery"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}
