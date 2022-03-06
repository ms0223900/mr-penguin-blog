import { API } from 'config';

const getArticleList = () => fetch(`${API}/articles`, {}).then();
