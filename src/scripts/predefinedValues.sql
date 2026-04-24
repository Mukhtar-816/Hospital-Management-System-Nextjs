INSERT INTO Permission (name) VALUES
('request_appointment'),
('manage_own_appointments'),
('view_own_records'),

('manage_requests'),
('manage_appointments'),
('manage_patients'),

('view_assigned_appointments'),
('manage_interactions'),
('manage_medical_records'),

('manage_users'),
('assign_roles'),
('view_all_data');

INSERT INTO Role (name) VALUES 
('patient'),
('doctor'),
('receptionist'),
('admin');




INSERT INTO RolePermission (roleId, permissionId)
VALUES
((SELECT roleId FROM Role WHERE name='patient'),
 (SELECT permissionId FROM Permission WHERE name='request_appointment')),

((SELECT roleId FROM Role WHERE name='patient'),
 (SELECT permissionId FROM Permission WHERE name='manage_own_appointments')),

((SELECT roleId FROM Role WHERE name='patient'),
 (SELECT permissionId FROM Permission WHERE name='view_own_records'));

INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'request_appointment',
  'manage_own_appointments',
  'view_own_records'
)
WHERE r.name = 'patient';

INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'manage_requests',
  'manage_appointments',
  'manage_patients'
)
WHERE r.name = 'receptionist';

INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON p.name IN (
  'view_assigned_appointments',
  'manage_interactions',
  'manage_medical_records'
)
WHERE r.name = 'doctor';


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.roleId, p.permissionId
FROM Role r
JOIN Permission p ON TRUE
WHERE r.name = 'admin';