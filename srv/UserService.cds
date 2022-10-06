using {db} from '../db/data-model';

service UserService @(path : '/user') {
    @readOnly
    entity Users as projection on db.Users;
}
