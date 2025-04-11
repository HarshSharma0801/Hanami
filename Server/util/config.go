package util

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Driver               string        `mapstructure:"DRIVER"`
	DbUrl                string        `mapstructure:"DB_URL"`
	Port                 string        `mapstructure:"PORT"`
	Api_Url              string        `mapstructure:"API_URL"`
	TokenSymmetricKey    string        `mapstructure:"TOKEN_SYMMETRIC_KEY"`
	AccessTokenDuration  time.Duration `mapstructure:"ACCESS_TOKEN_DURATION"`
	RefreshTokenDuration time.Duration `mapstructure:"REFRESH_TOKEN_DURATION"`
	ENVIRONMENT          string        `mapstructure:"ENVIRONMENT"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	// Enable environment variable overrides
	viper.AutomaticEnv()

	// Read config file, but don't fail if it's missing
	err = viper.ReadInConfig()
	if err != nil {
		// Ignore file not found errors; rely on env vars
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return config, err
		}
	}

	err = viper.Unmarshal(&config)
	return config, err
}