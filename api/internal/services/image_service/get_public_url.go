package imageservice

import "fmt"

func (s *ImageService) GetPublicUrl(s3Key string) string {
	if s3Key == "" {
		return ""
	}
	return fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.bucket, s.region, s3Key)
}