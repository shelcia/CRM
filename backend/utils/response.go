package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// Success sends a response in the shape { status: "200", message: ... }
// which is what the frontend checks for (res.status === "200").
func Success(c *gin.Context, status int, message interface{}) {
	c.JSON(status, gin.H{
		"status":  strconv.Itoa(status),
		"message": message,
	})
}

// Err sends an error response in the same { status, message } shape.
func Err(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{
		"status":  strconv.Itoa(status),
		"message": message,
	})
}
