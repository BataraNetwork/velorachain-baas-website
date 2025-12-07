CREATE TABLE public.api_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    key_hash text NOT NULL,
    key_prefix character varying(20) NOT NULL,
    scopes jsonb NOT NULL DEFAULT '[]'::jsonb,
    rate_limit_per_minute integer,
    rate_limit_per_hour integer,
    rate_limit_per_day integer,
    expires_at timestamp without time zone,
    last_used_at timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.api_key_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    api_key_id uuid NOT NULL,
    endpoint character varying(255) NOT NULL,
    count integer DEFAULT 1,
    timestamp timestamp without time zone DEFAULT now()
);

CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active);
CREATE INDEX idx_api_key_usage_key_id ON public.api_key_usage(api_key_id);
CREATE INDEX idx_api_key_usage_timestamp ON public.api_key_usage(timestamp);

ALTER TABLE public.api_keys
    ADD CONSTRAINT fk_api_keys_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.api_key_usage
    ADD CONSTRAINT fk_api_key_usage_key FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id) ON DELETE CASCADE;
