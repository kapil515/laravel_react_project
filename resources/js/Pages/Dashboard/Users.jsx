import UserList from '@/Components/Users/Index';
// import UserList from '@/Components/Users/Edit';

export default function Users({ users }) {
    return (
        <div>
            <UserList users={users} />
        </div>


    );
}
