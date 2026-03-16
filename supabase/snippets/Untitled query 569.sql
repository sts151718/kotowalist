
create function upsert_decline_post_templates(_id integer, _decline_sitiation text, _actual_situation json, _actual_feeling json, _demerit json, _templates_json json) RETURNS uuid
 AS $$ 
DECLARE
  post_public_id uuid;
  rec RECORD;
begin
    UPDATE decline_posts SET decline_sitiation = _decline_sitiation,  actual_situation = _actual_situation, actual_feeling = _actual_feeling, demerit = _demerit
    RETURNING public_id INTO post_public_id;

  FOR rec IN
    SELECT
      *
    FROM
      json_to_recordset(_templates_json)
      AS rec
      (
        opening_text text,
        closing_text text,
        done_flag boolean,
        done_result text
      )
  LOOP
    INSERT INTO decline_templates(post_id, opening_text, closing_text, done_flag, done_result)
      VALUES (new_post_id, rec.opening_text, rec.closing_text, rec.done_flag, rec.done_result);
  END LOOP;

  return new_post_public_id;
END
$$ LANGUAGE plpgsql