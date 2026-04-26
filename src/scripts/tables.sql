CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE Users (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userName VARCHAR(50) UNIQUE NOT NULL,
  userEmail VARCHAR(100) UNIQUE NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- RBAC
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

-- DOMAIN
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