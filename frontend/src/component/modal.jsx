function Modal(props) {
	return (
		<>
			<div className='modal fade' tabIndex='-1' id={props.id}>
				<div
					className={`modal-dialog ${props.size || 'modal-xl'} ${
						props.scrollable || ''
					}`}
				>
					<div className='modal-content'>
						<div className='modal-header'>
							{props.back ? (
								<button
									type='button'
									className='btn-close'
									data-bs-toggle='modal'
									data-bs-target={'#' + props.back}
									aria-label='Back'
								></button>
							) : (
								<button
									type='button'
									className='btn-close'
									data-bs-dismiss='modal'
									aria-label='Close'
									id={props.id + '_btnClose'}
								></button>
							)}
						</div>
						<div className='modal-body'>
							<div className='card border-Modal'>
								<div className='card-header form-Head form-Head-Background'>
									<i className={props.icon + ' me-1'}></i>
									{props.title}
								</div>
								<div className='card-body'>{props.children}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default Modal;
