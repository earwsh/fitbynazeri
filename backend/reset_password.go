package main

import (
	"fmt"
	"backend/database"
	"backend/models"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	database.ConnectDB()
	var user models.User
	if err := database.DB.Where("email = ?", "mehdi.nz94@gmail.com").First(&user).Error; err != nil {
		fmt.Printf("Error finding user: %v\n", err)
		return
	}
	newPass := "Mehdi@123456"
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPass), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err)
		return
	}
	user.Password = string(hashed)
	if err := database.DB.Save(&user).Error; err != nil {
		fmt.Printf("Error updating user: %v\n", err)
		return
	}
	fmt.Printf("SUCCESS: Password updated for %s (ID %d, Role: %s)\n", user.Email, user.ID, user.Role)
}
