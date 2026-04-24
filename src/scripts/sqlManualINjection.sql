-- =========================
-- EXTENSIONS
-- =========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- USERS
-- =========================
CREATE TABLE Users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userName VARCHAR(50) UNIQUE NOT NULL,
  userEmail VARCHAR(100) UNIQUE NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- =========================
-- RBAC TABLES
-- =========================

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
  roleId UUID NOT NULL,

  CONSTRAINT fk_userrole_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
  CONSTRAINT fk_userrole_role FOREIGN KEY (roleId) REFERENCES Role(roleId) ON DELETE CASCADE
);

CREATE TABLE RolePermission (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roleId UUID NOT NULL,
  permissionId UUID NOT NULL,

  CONSTRAINT fk_roleperm_role FOREIGN KEY (roleId) REFERENCES Role(roleId) ON DELETE CASCADE,
  CONSTRAINT fk_roleperm_perm FOREIGN KEY (permissionId) REFERENCES Permission(permissionId) ON DELETE CASCADE
);

-- =========================
-- DOMAIN TABLES
-- =========================

CREATE TABLE Patient (
  patientId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE, -- nullable for walk-in
  patientNumber BIGINT UNIQUE,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  gender VARCHAR(20) CHECK (gender IN ('male','female','other')),
  createdAt TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_patient_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL
);

CREATE TABLE Doctor (
  doctorId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL,
  specialization VARCHAR(100),
  status VARCHAR(50),

  CONSTRAINT fk_doctor_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

CREATE TABLE Receptionist (
  receptionistId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID UNIQUE NOT NULL,

  CONSTRAINT fk_receptionist_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- =========================
-- APPOINTMENT FLOW
-- =========================

CREATE TABLE AppointmentRequest (
  requestId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patientId UUID NOT NULL,
  receptionistId UUID,
  symptoms TEXT,
  preferredTime TIMESTAMP,
  priority VARCHAR(20),
  status VARCHAR(20),
  createdAt TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_req_patient FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE,
  CONSTRAINT fk_req_receptionist FOREIGN KEY (receptionistId) REFERENCES Receptionist(receptionistId) ON DELETE SET NULL
);

CREATE TABLE Appointment (
  appointmentId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requestId UUID,
  doctorId UUID NOT NULL,
  patientId UUID NOT NULL,
  receptionistId UUID NOT NULL,
  startTime TIMESTAMP,
  endTime TIMESTAMP,
  type VARCHAR(20), -- 'online' or 'walk-in'
  status VARCHAR(20),
  createdAt TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_app_request FOREIGN KEY (requestId) REFERENCES AppointmentRequest(requestId) ON DELETE SET NULL,
  CONSTRAINT fk_app_doctor FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId) ON DELETE CASCADE,
  CONSTRAINT fk_app_patient FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE,
  CONSTRAINT fk_app_receptionist FOREIGN KEY (receptionistId) REFERENCES Receptionist(receptionistId) ON DELETE CASCADE
);

-- =========================
-- MEDICAL FLOW
-- =========================

CREATE TABLE Interaction (
  interactionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointmentId UUID NOT NULL,
  patientId UUID NOT NULL,
  doctorId UUID NOT NULL,
  notes TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_interaction_app FOREIGN KEY (appointmentId) REFERENCES Appointment(appointmentId) ON DELETE CASCADE,
  CONSTRAINT fk_interaction_patient FOREIGN KEY (patientId) REFERENCES Patient(patientId) ON DELETE CASCADE,
  CONSTRAINT fk_interaction_doctor FOREIGN KEY (doctorId) REFERENCES Doctor(doctorId) ON DELETE CASCADE
);

CREATE TABLE Prescription (
  prescriptionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interactionId UUID NOT NULL,
  medicine VARCHAR(100),
  frequency VARCHAR(50),
  duration VARCHAR(50),
  instructions TEXT,

  CONSTRAINT fk_prescription_interaction FOREIGN KEY (interactionId) REFERENCES Interaction(interactionId) ON DELETE CASCADE
);

CREATE TABLE Diagnosis (
  diagnosisId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interactionId UUID NOT NULL,
  description TEXT,

  CONSTRAINT fk_diagnosis_interaction FOREIGN KEY (interactionId) REFERENCES Interaction(interactionId) ON DELETE CASCADE
);

-- =========================
-- INDEXES (IMPORTANT)
-- =========================

CREATE INDEX idx_user_email ON Users(userEmail);
CREATE INDEX idx_patient_user ON Patient(userId);
CREATE INDEX idx_doctor_user ON Doctor(userId);
CREATE INDEX idx_receptionist_user ON Receptionist(userId);

CREATE INDEX idx_appointment_patient ON Appointment(patientId);
CREATE INDEX idx_appointment_doctor ON Appointment(doctorId);

CREATE INDEX idx_interaction_appointment ON Interaction(appointmentId);