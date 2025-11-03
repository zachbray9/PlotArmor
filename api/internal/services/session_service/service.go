package sessionservice

import sessionrepository "myanimevault/internal/repository/session_repository"

type SessionService struct {
	sessionRepo sessionrepository.SessionRepository
}

func NewSessionService(sessionRepo sessionrepository.SessionRepository) *SessionService {
	return &SessionService{
		sessionRepo: sessionRepo,
	}
}