import Link from 'next/link';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const WorkProjectList = () => {
    const router = useRouter();
    const isWorkProjectPath = router.pathname === '/projects/work';
    const isSideProjectPath = router.pathname === '/projects/side';

    return (
        <div className={"flex flex-col items-center gap-2 p-4"}>
            <div className={"flex flex-row gap-2"}>
                <Link href="/projects/work">
                    <Button variant={isWorkProjectPath ? 'contained' : 'outlined'}>Work Projects</Button>
                </Link>
                <Link href="/projects/side">
                    <Button variant={isSideProjectPath ? 'contained' : 'outlined'}>Side Projects</Button>
                </Link>
            </div>
            <h1>Work Project List</h1>
        </div>
    )
}

export default WorkProjectList;