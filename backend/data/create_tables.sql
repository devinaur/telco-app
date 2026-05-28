CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    price INT NOT NULL,
    quota_amount VARCHAR(20),
    validity VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_promo BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.reward_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    required_points INT NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    quantity INT DEFAULT 0,
    initial_stock INT DEFAULT 0,
    expires_at DATE,
    description TEXT,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_otps (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    purpose VARCHAR(50) CHECK (purpose IN ('register', 'login', 'reset_password', 'change_phone')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_otps_user_id ON public.user_otps(user_id);

CREATE TABLE IF NOT EXISTS public.user_balance (
    user_id INT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    balance INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_point_balances (
    user_id INT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    balance INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_quotas (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES public.products(id),
    quota VARCHAR(50),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase','topup')),
    affects_balance BOOLEAN DEFAULT TRUE,
    description TEXT NOT NULL,
    user_quota_id INT REFERENCES public.user_quotas(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_points (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    points INT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earn','redeem')),
    reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_points_user_id ON public.user_points(user_id);

CREATE TABLE IF NOT EXISTS public.user_rewards (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reward_item_id INT NOT NULL REFERENCES public.reward_items(id),
    status VARCHAR(20) DEFAULT 'claimed',
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_behavior_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) CHECK (
        event_type IN ('view_product','purchase','topup','login','redeem_reward')
    ),
    event_detail TEXT,
    product_id INT REFERENCES public.products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_behavior_logs_user_id ON public.user_behavior_logs(user_id);

CREATE TABLE IF NOT EXISTS public.ml_features (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    customer_id VARCHAR(50) NOT NULL,
    plan_type VARCHAR(20) NOT NULL,
    device_brand VARCHAR(50) NOT NULL,
    avg_data_usage_gb DOUBLE PRECISION NOT NULL,
    pct_video_usage DOUBLE PRECISION NOT NULL,
    avg_call_duration DOUBLE PRECISION NOT NULL,
    sms_freq INT NOT NULL,
    monthly_spend DOUBLE PRECISION NOT NULL,
    topup_freq INT NOT NULL,
    travel_score DOUBLE PRECISION NOT NULL,
    complaint_count INT NOT NULL,
    target_offer VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_ml_features_user_id ON public.ml_features(user_id);
CREATE INDEX idx_ml_features_customer_id ON public.ml_features(customer_id);

CREATE TABLE IF NOT EXISTS public.user_notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);

CREATE TABLE IF NOT EXISTS public.user_checkins (
    user_id INT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    streak_count INT DEFAULT 0,
    last_checkin_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);