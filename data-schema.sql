CREATE TABLE IF NOT EXISTS public.user_task
(
    task_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1000 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    task_detail character varying COLLATE pg_catalog."default" NOT NULL,
    task_duration character varying COLLATE pg_catalog."default",
    task_status character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL,
    CONSTRAINT user_task_pkey PRIMARY KEY (task_id)
);

INSERT INTO public.user_task(
	task_detail, task_duration, task_status,  user_id)
	VALUES ('task detail','1 hr','pending',1);

    CREATE TABLE IF NOT EXISTS public.user_info
(
    user_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1000 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    full_name character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 134567890,
    address character varying COLLATE pg_catalog."default",
    auth_role json NOT NULL,
    CONSTRAINT employee_pkey PRIMARY KEY (user_id)
);


CREATE TABLE IF NOT EXISTS public.account_type
(
    account_type_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1001 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    account_type character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT branch_pkey PRIMARY KEY (account_type_id)
);

CREATE TABLE IF NOT EXISTS public.transactions
(
    txn_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 10 START 10000 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    txn_type character varying COLLATE pg_catalog."default" NOT NULL,
    amount double precision NOT NULL,
    to_from character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location character varying COLLATE pg_catalog."default" NOT NULL,
    remarks character varying COLLATE pg_catalog."default",
    account_id integer NOT NULL,
    created_by integer NOT NULL,
    CONSTRAINT account_id_fkey FOREIGN KEY (account_id)
        REFERENCES public.account_type (account_type_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE IF NOT EXISTS public.user_login_log
(
	log_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1000 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
	user_id integer NOT NULL,
	action character varying COLLATE pg_catalog."default" NOT NULL,
	created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_login_log_pkey PRIMARY KEY (log_id)
);

-- index to speed up queries by user and time
CREATE INDEX IF NOT EXISTS idx_user_login_log_user_time ON public.user_login_log (user_id, created_at);