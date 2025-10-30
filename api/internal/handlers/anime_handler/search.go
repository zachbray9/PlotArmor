package animehandler

import (
	"myanimevault/internal/models/responses"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *AnimeHandler) Search(context *gin.Context) {
	// Extract query parameters
    query := context.Query("q")
    page, _ := strconv.Atoi(context.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(context.DefaultQuery("limit", "20"))
    sort := context.DefaultQuery("sort", "relevance")

    // Validate required params
    if query == "" {
        context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
            Message: "Search query parameter 'q' is required",
			Data: nil,
        })
        return
    }

    // Call service
    response, err := h.animeService.Search(context.Request.Context(), query, page, limit, sort)
    if err != nil {
        context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
            Message: "Something went wrong with the search. Please try again.",
			Data: nil,
        })
        return
    }

    context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Search was successful.",
		Data: response,
	})

}
