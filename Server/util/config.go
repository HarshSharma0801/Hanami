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

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return

}
