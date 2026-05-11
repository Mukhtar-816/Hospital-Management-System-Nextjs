ALTER TABLE UserRole
ADD CONSTRAINT fk_userrole_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
ADD CONSTRAINT fk_userrole_role FOREIGN KEY (roleId) REFERENCES Role(roleId) ON DELETE CASCADE,
ADD CONSTRAINT unique_user_role UNIQUE (userId, roleId);

ALTER TABLE RolePermission
ADD CONSTRAINT fk_roleperm_role FOREIGN KEY (roleId) REFERENCES Role(roleId) ON DELETE CASCADE,
ADD CONSTRAINT fk_roleperm_perm FOREIGN KEY (permissionId) REFERENCES Permission(permissionId) ON DELETE CASCADE,
ADD CONSTRAINT unique_role_permission UNIQUE (roleId, permissionId);

ALTER TABLE Patient
ADD CONSTRAINT fk_patient_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE SET NULL;

ALTER TABLE Doctor
ADD CONSTRAINT fk_doctor_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE;

ALTER TABLE Receptionist
ADD CONSTRAINT fk_receptionist_user FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE;