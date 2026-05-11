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


CREATE OR REPLACE FUNCTION notify_on_appointment_scheduled()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'scheduled' AND (OLD.status IS DISTINCT FROM 'scheduled') THEN

    INSERT INTO Notifications (messageText, userid)
    SELECT
      'You have a new appointment scheduled on ' || TO_CHAR(NEW.starttime, 'Mon DD, YYYY') || ' at ' || TO_CHAR(NEW.starttime, 'HH12:MI AM') || '.',
      d.userId
    FROM Doctor d
    WHERE d.doctorId = NEW.doctorid;

    INSERT INTO Notifications (messageText, userid)
    SELECT
      'Your appointment has been scheduled on ' || TO_CHAR(NEW.starttime, 'Mon DD, YYYY') || ' at ' || TO_CHAR(NEW.starttime, 'HH12:MI AM') || '.',
      p.userId
    FROM Patient p
    WHERE p.patientId = NEW.patientid;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_appointment_scheduled
AFTER INSERT OR UPDATE OF status
ON appointment
FOR EACH ROW
EXECUTE FUNCTION notify_on_appointment_scheduled();