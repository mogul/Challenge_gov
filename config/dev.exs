use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with webpack to recompile .js and .css sources.
config :challenge_gov, Web.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [
    node: [
      "node_modules/webpack/bin/webpack.js",
      "--mode",
      "development",
      "--watch-stdin",
      cd: Path.expand("../assets", __DIR__)
    ]
  ]

# ## SSL Support
#
# In order to use HTTPS in development, a self-signed
# certificate can be generated by running the following
# Mix task:
#
#     mix phx.gen.cert
#
# Note that this task requires Erlang/OTP 20 or later.
# Run `mix help phx.gen.cert` for more information.
#
# The `http:` config above can be replaced with:
#
#     https: [
#       port: 4001,
#       cipher_suite: :strong,
#       keyfile: "priv/cert/selfsigned_key.pem",
#       certfile: "priv/cert/selfsigned.pem"
#     ],
#
# If desired, both `http:` and `https:` keys can be
# configured to run both http and https servers on
# different ports.

# Watch static and templates for browser reloading.
config :challenge_gov, Web.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{lib/web/views/.*(ex)$},
      ~r{lib/web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# cache
config :challenge_gov, :cache, preload: true

# authorize config
config :challenge_gov, :oidc_config, %{
  idp_authorize_url: "https://idp.int.identitysandbox.gov/openid_connect/authorize",
  acr_value: "http://idmanagement.gov/ns/assurance/loa/1",
  redirect_uri: "http://localhost:4000/auth/result",
  client_id: "urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:challenge_test_app",
  private_key_path: "private.pem",
  public_key_path: "cert.pem"
}

# Configure your database
config :challenge_gov, ChallengeGov.Repo,
  username: "postgres",
  password: "postgres",
  database: "challenge_gov_dev",
  hostname: "localhost",
  pool_size: 10

config :challenge_gov, ChallengeGov.Mailer,
  from: "support@challenge.gov",
  adapter: Bamboo.LocalAdapter

config :challenge_gov, :recaptcha, module: ChallengeGov.Recaptcha.Mock

if File.exists?("config/dev.local.exs") do
  import_config("dev.local.exs")
end
