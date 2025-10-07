package imagehandler

import (
	"io"
	"myanimevault/internal/models/responses"
	"myanimevault/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *ImageHandler) UploadImageHandler(context *gin.Context) {
	header, err := context.FormFile("image")
	if err != nil {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false,
			Message: "No image file provided",
			Data: nil,
		})
		return
	}

	file, err := header.Open()
	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success: false,
			Message: "Failed to read uploaded file",
			Data: nil,
		})
		return
	}
	defer file.Close()

	//validate file type
	contentType := header.Header.Get("Content-Type")
	fileType := utils.GetExtensionFromContentType(contentType)
	if !utils.IsValidImageType(fileType) {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success: false, 
			Message: "File must be an image (JPEG, PNG, or WebP)",
			Data: nil,
		})
		return
	}

	//validate image size
	if !utils.IsValidImageSize(header.Size) {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success:   false,
			Message: "Image must be smaller than 10MB",
			Data: nil,
		})
		return
	}

	// Get image type and anime title from form data
	imageType := context.PostForm("type")   // "poster" or "banner"
	animeTitle := context.PostForm("title") // anime title for filename

	if imageType == "" {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success:   false,
			Message: "Image type (poster or banner) is required",
		})
		return
	}

	if animeTitle == "" {
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success:   false,
			Message: "Anime title is required for filename",
		})
		return
	}

	// Read file data into bytes
	fileData, err := io.ReadAll(file)
	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success:   false,
			Message: "Failed to read uploaded file",
			Data: nil,
		})
		return
	}

	// Upload using appropriate method based on type
	var s3key string
	switch imageType {
	case "poster":
		s3key, err = h.ImageService.UploadPoster(context, fileData, animeTitle, fileType)
	case "banner":
		s3key, err = h.ImageService.UploadBanner(context, fileData, animeTitle, fileType)
	default:
		context.JSON(http.StatusBadRequest, responses.ApiResponse{
			Success:   false,
			Message: "Image type must be 'poster' or 'banner'",
			Data: nil,
		})
		return
	}

	if err != nil {
		context.JSON(http.StatusInternalServerError, responses.ApiResponse{
			Success:   false,
			Message: "Failed to upload image to storage",
			Data: nil,
		})
		return
	}

	// Return the S3 URL
	context.JSON(http.StatusOK, responses.ApiResponse{
		Success: true,
		Message: "Successfully uploaded image",
		Data: s3key,
	})
}
