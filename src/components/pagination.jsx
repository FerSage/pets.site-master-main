import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pages.map((page) => (
                    <li
                        key={page}
                        className={`page-item ${page === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        <button className="page-link">{page}</button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
