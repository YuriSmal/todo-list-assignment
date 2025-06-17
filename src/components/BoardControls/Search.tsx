import { type ChangeEvent } from 'react';
import { useTaskContext } from '../../context';

export const Search = () => {
    const { searchTerm, setSearchTerm } = useTaskContext();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }

    return (
        <div className='search-bar'>
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    )
}