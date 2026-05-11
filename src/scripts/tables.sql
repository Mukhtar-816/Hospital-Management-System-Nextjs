CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE Users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userName VARCHAR(50) UNIQUE NOT NULL,
  userEmail VARCHAR(100) UNIQUE NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Notifications (
    notificationId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    messageText VARCHAR NOT NULL,
    userid UUID,
    CONSTRAINT fk_key FOREIGN KEY (userid) REFERENCES users(userid) 
);

CREATE TABLE Role (
  roleId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Permission (
  permissionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE UserRole (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL,
  roleId UUID NOT NULL
);

CREATE TABLE RolePermission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roleId UUID NOT NULL,
  permissionId UUID NOT NULL
);

CREATE TABLE Patient (
  patientId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE,
  patientNumber BIGSERIAL UNIQUE,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  gender VARCHAR(20),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Doctor (
  doctorId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL,
  specialization VARCHAR(100),
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Receptionist (
  receptionistId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE AppointmentRequest (
  requestId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL,
  symptoms TEXT,
  preferredTime TIMESTAMP,
  priority VARCHAR(50),
  status VARCHAR(50),
  createdAt TIMESTAMP DEFAULT NOW(),
  receptionistId UUID,
  CONSTRAINT fk_appreq_patient FOREIGN KEY (patientId) REFERENCES Patient(patientId),
  CONSTRAINT fk_appreq_receptionist FOREIGN KEY (receptionistId) REFERENCES Receptionist(receptionistId)
);

CREATE TABLE Appointment (
  appointmentId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requestId UUID,
  doctorId UUID NOT NULL,
  patientId UUID NOT NULL,
  receptionistId UUID NOT NULL,
  startTime TIMESTAMP NOT NULL,
  endTime TIMESTAMP NOT NULL,
  type VARCHAR(50) DEFAULT 'walk-in',
  status VARCHAR(20) DEFAULT 'scheduled',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_apt_request FOREIGN KEY (requestId) REFERENCES AppointmentRequest(requestId),
  CONSTRAINT fk_apt_doctor FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId) ON DELETE CASCADE,
  CONSTRAINT fk_apt_patient FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE,
  CONSTRAINT fk_apt_receptionist FOREIGN KEY (receptionistId) REFERENCES Receptionist(receptionistId)
);

CREATE TABLE Interaction (
  interactionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointmentId UUID NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  receptionistId UUID,
  CONSTRAINT fk_interaction_appointment FOREIGN KEY (appointmentId) REFERENCES Appointment(appointmentId),
  CONSTRAINT fk_interaction_receptionist FOREIGN KEY (receptionistId) REFERENCES Receptionist(receptionistId)
);

CREATE TABLE Prescription (
  prescriptionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interactionId UUID NOT NULL,
  medicationId VARCHAR(100),
  medicine TEXT,
  frequency VARCHAR(100),
  doctor TEXT,
  instructions TEXT,
  CONSTRAINT fk_prescription_interaction FOREIGN KEY (interactionId) REFERENCES Interaction(interactionId)
);

CREATE TABLE Diagnosis (
  diagnosisId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interactionId UUID NOT NULL,
  description TEXT,
  CONSTRAINT fk_diagnosis_interaction FOREIGN KEY (interactionId) REFERENCES Interaction(interactionId)
);

ALTER TABLE UserRole
  ADD CONSTRAINT fk_userrole_user FOREIGN KEY (userId) REFERENCES Users(userId),
  ADD CONSTRAINT fk_userrole_role FOREIGN KEY (roleId) REFERENCES Role(roleId);

ALTER TABLE RolePermission
  ADD CONSTRAINT fk_roleperm_role FOREIGN KEY (roleId) REFERENCES Role(roleId),
  ADD CONSTRAINT fk_roleperm_permission FOREIGN KEY (permissionId) REFERENCES Permission(permissionId);

ALTER TABLE Patient
  ADD CONSTRAINT fk_patient_user FOREIGN KEY (userId) REFERENCES Users(userId);

ALTER TABLE Doctor
  ADD CONSTRAINT fk_doctor_user FOREIGN KEY (userId) REFERENCES Users(userId);

ALTER TABLE Receptionist
  ADD CONSTRAINT fk_receptionist_user FOREIGN KEY (userId) REFERENCES Users(userId);
