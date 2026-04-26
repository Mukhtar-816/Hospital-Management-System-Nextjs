CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON Users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_patient_updated
BEFORE UPDATE ON Patient
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_doctor_updated
BEFORE UPDATE ON Doctor
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_receptionist_updated
BEFORE UPDATE ON Receptionist
FOR EACH ROW EXECUTE FUNCTION set_updated_at();