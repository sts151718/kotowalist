CREATE OR REPLACE FUNCTION public.upsert_decline_post_templates(
  _id integer,
  _decline_sitiation text,
  _actual_situation json,
  _actual_feeling json,
  _demerit json,
  _templates_json json
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  post_public_id uuid;
  rec RECORD;
BEGIN
  UPDATE decline_posts
    SET decline_situation = _decline_sitiation,
        actual_situation = _actual_situation,
        actual_feeling = _actual_feeling,
        demerit = _demerit,
        updated_at = now()
    WHERE id = _id
    RETURNING public_id INTO post_public_id;

  IF post_public_id IS NULL THEN
    RAISE EXCEPTION 'decline_post not found: %', _id;
  END IF;

  FOR rec IN
    SELECT
      *
    FROM
      json_to_recordset(_templates_json) AS rec(
        id integer,
        opening_text text,
        closing_text text,
        done_flag boolean,
        done_result text
      )
  LOOP
    IF rec.id IS NULL THEN
      INSERT INTO decline_templates(post_id, opening_text, closing_text, done_flag, done_result)
      VALUES (_id, rec.opening_text, rec.closing_text, rec.done_flag, rec.done_result);
    ELSE
      UPDATE decline_templates
        SET opening_text = rec.opening_text,
            closing_text = rec.closing_text,
            done_flag = rec.done_flag,
            done_result = rec.done_result,
            updated_at = now()
        WHERE id = rec.id
          AND post_id = _id;
    END IF;
  END LOOP;

  RETURN post_public_id;
END
$function$;
