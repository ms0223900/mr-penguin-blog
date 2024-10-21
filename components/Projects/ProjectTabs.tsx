import Link from 'next/link';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const ProjectTabs = () => {
    const router = useRouter();
    const isWorkProjectPath = router.pathname === '/projects/work';
    const isSideProjectPath = router.pathname === '/projects/side';

    return (
        <div className={"flex flex-row gap-2"}>
            <Link href="/projects/work">
                <Button variant={isWorkProjectPath ? 'contained' : 'outlined'}>Work Projects</Button>
            </Link>
            <Link href="/projects/side">
                <Button variant={isSideProjectPath ? 'contained' : 'outlined'}>Side Projects</Button>
            </Link>
        </div>
    )
}

export default ProjectTabs;