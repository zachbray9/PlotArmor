package imageservice

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	_ "image/png"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/chai2010/webp"
	"github.com/nfnt/resize"
)

func init() {
	image.RegisterFormat("webp", "RIFF????WEBPVP8", webp.Decode, webp.DecodeConfig)
}

func (s *ImageService) UploadPoster(ctx context.Context, imageData []byte, animeTitle string, imageExt string) (string, error) {
	// Decode the image
	img, _, err := image.Decode(bytes.NewReader(imageData))
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %w", err)
	}

	baseS3Key := fmt.Sprintf("posters/%s-%d", strings.ReplaceAll(strings.ToLower(animeTitle), " ", "-"), time.Now().Unix())

	// Upload original to S3
	originalFileName := baseS3Key + ".jpg"
	originalBuf := new(bytes.Buffer)
	if err := jpeg.Encode(originalBuf, img, &jpeg.Options{Quality: 95}); err != nil {
		return "", fmt.Errorf("failed to encode jpg: %w", err)
	}

	_, err = s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(originalFileName),
		Body:   bytes.NewReader(originalBuf.Bytes()),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload original poster to S3: %w", err)
	}

	//resize to small and upload small image to s3
	smallFileName := baseS3Key + "-small.jpg"
	smallImg := resize.Resize(200, 0, img, resize.Lanczos3)
	smallBuf := new(bytes.Buffer)
	if err := jpeg.Encode(smallBuf, smallImg, &jpeg.Options{Quality: 90}); err != nil {
		return "", fmt.Errorf("failed to encode jpg: %w", err)
	}

	_, err = s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(smallFileName),
		Body:        bytes.NewReader(smallBuf.Bytes()),
		ContentType: aws.String("image/jpeg"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload small poster to S3: %w", err)
	}

	//return filename (aka the s3 key)
	return baseS3Key, nil
}

func (s *ImageService) UploadBanner(ctx context.Context, imageData []byte, animeTitle string, imageExt string) (string, error) {
	// Generate unique filename for banner
	filename := fmt.Sprintf("banners/%s-%d%s", strings.ReplaceAll(strings.ToLower(animeTitle), " ", "-"), time.Now().Unix(), imageExt)

	// Upload to S3
	_, err := s.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(filename),
		Body:   bytes.NewReader(imageData),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload banner to S3: %w", err)
	}

	//return filename (aka the s3 key)
	return filename, nil
}
