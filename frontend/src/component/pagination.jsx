import React, { useState } from 'react';
import { pageSize as defaultPageSize } from '../config_variable';

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalRecords,
	onPageSizeChange
}) => {
	const range = 5; 
	const startPage = Math.max(1, currentPage - range);
	const endPage = Math.min(totalPages, currentPage + range);
	const [inputPageSize, setInputPageSize] = useState(defaultPageSize);

	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	const handlePageSizeChange = () => {
		const newSize = Number(inputPageSize);
		if (newSize > 0) {
			onPageSizeChange(newSize);
		}
	};

	const renderPaginationItems = () => {
		const items = [];
		if (currentPage > range + 1) {
			items.push(
				<li key='first' className='page-item'>
					<button className='page-link' onClick={() => handlePageChange(1)}>
						1
					</button>
				</li>
			);
		}

		if (startPage > 2) {
			items.push(
				<li key='prev-ellipsis' className='page-item disabled'>
					<span className='page-link'>...</span>
				</li>
			);
		}

		for (let i = startPage; i <= endPage; i++) {
			items.push(
				<li
					key={i}
					className={`page-item ${i === currentPage ? 'active' : ''}`}
				>
					<button className='page-link' onClick={() => handlePageChange(i)}>
						{i}
					</button>
				</li>
			);
		}

		if (endPage < totalPages - 1) {
			items.push(
				<li key='next-ellipsis' className='page-item disabled'>
					<span className='page-link'>...</span>
				</li>
			);
		}

		if (currentPage < totalPages - range) {
			items.push(
				<li key='last' className='page-item'>
					<button
						className='page-link'
						onClick={() => handlePageChange(totalPages)}
					>
						{totalPages}
					</button>
				</li>
			);
		}

		return items;
	};

	return (
		<nav aria-label='Page navigation'>
			<div className='flex-sm-fill d-sm-flex '>
				<span className='small text-muted mt-1'>
					&nbsp;Showing&nbsp;
					<input
						type='number'
						value={inputPageSize}
						onChange={(e) => setInputPageSize(e.target.value)}
						style={{ width: '15%' }}
						className='text-end'
					/>{' '}
					/ page&nbsp;
					<button
						className=' btn btn-sm form-Button-Edit me-1'
						onClick={handlePageSizeChange}
					>
						<i className='bi bi-gear-fill'></i>
					</button>
					&nbsp;from&nbsp;
					<span className='fw-semibold'>{totalRecords}</span>
					&nbsp;results
				</span>
				<ul className='pagination pagination-sm me-3 mt-1'>
					<li className='page-item'>
						<button
							className='page-link'
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							&lt;
						</button>
					</li>
					{renderPaginationItems()}
					<li className='page-item'>
						<button
							className='page-link'
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							&gt;
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Pagination;
