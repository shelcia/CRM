package utils

import (
	"log"
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

// Err sends an error response and logs the failure to stdout.
// Pass the underlying error as the optional cause argument to include it in the log.
func Err(c *gin.Context, status int, message string, cause ...error) {
	if len(cause) > 0 && cause[0] != nil {
		log.Printf("[ERROR] %s %s %d — %s: %v", c.Request.Method, c.Request.URL.Path, status, message, cause[0])
	} else {
		log.Printf("[ERROR] %s %s %d — %s", c.Request.Method, c.Request.URL.Path, status, message)
	}
	c.JSON(status, gin.H{
		"status":  strconv.Itoa(status),
		"message": message,
	})
}
