package handlers

import (
	"net/http"

	"tinycrm/enums"

	"github.com/gin-gonic/gin"
)

// GetEnums returns all constrained enum values. No auth required so the
// frontend can load them before login if needed.
func GetEnums(c *gin.Context) {
	c.JSON(http.StatusOK, enums.All())
}
