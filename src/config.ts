export const config = {
  authentication_url: 'http://localhost:8083',
  signup_url: 'http://localhost:8082/signup',
  password_url: 'http://localhost:8082/password',
  oauth2_url: 'http://localhost:8082/oauth2',

  user_url: 'http://localhost:8083/users',
  role_url: 'http://localhost:8083/roles',
  privilege_url: 'http://localhost:8080/privileges',
  audit_log_url: 'http://localhost:8080/audit-logs',
  cinema_url: 'http://localhost:8080/cinema',
  category_url: 'http://localhost:8080/categories',
  film_url: 'http://localhost:8080/films',
  location_url: 'http://localhost:8085/locations',
  location_rate_url: 'http://localhost:8084/locationsrate',
  myprofile_url: 'http://localhost:8082/my-profile',
  profile_url:'http://localhost:8082/users',
  skill_url:'http://localhost:8082/skills',
  interest_url:'http://localhost:8082/interests'
};

export const env = {
  sit: {
    authentication_url: 'http://10.1.0.234:3003'
  },
  deploy: {
    authentication_url: '/server'
  }
};
