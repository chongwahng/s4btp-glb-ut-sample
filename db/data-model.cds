namespace db;

entity Users {
    key ID          : String(10);
        name        : String(100);
        dateOfBirth : Date;
        email       : String(100);
        isLock      : Boolean;
}
