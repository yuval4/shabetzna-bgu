import ListSkeleton from "../../../components/list-skeleton";
import { UserToTeam } from "../../../shared/types/entities/user-to-team";
import UserCard from "../user-card";

interface Props {
    users: UserToTeam[] | undefined;
    loading?: boolean;
}

const UsersList = ({ users = [], loading = false }: Props) => {
    if (loading) {
        return <ListSkeleton itemHeight={80} items={4} gap={12} />;
    }

    return <div>
        {users.map((user) => (
            <UserCard
                key={user.user.id}
                userToTeam={user}
            />
        ))}</div>
}

export default UsersList;