INSERT INTO Role (name) VALUES
('admin'),
('doctor'),
('receptionist'),
('patient');

INSERT INTO Permission (name) VALUES

-- USER
('create_user'),
('read_user'),
('update_user'),

-- PATIENT
('create_patient'),
('read_patient'),
('update_patient'),

-- DOCTOR
('create_doctor'),
('read_doctor'),
('update_doctor'),

-- RECEPTIONIST
('create_receptionist'),

-- COMMON
('read_own_data');


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r CROSS JOIN Permission p
WHERE r.name = 'admin';


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'create_patient',
  'read_patient',
  'create_user',
  'read_user'
)
WHERE r.name = 'receptionist';


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'read_doctor',
  'update_doctor',
  'read_patient',
  'read_own_data'
)
WHERE r.name = 'doctor';


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'read_own_data'
)
WHERE r.name = 'patient';