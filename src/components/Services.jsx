import React from 'react'

const Services = () => {
	return (
		<div className="lg:mx-20 mx-10 py-20 flex-1 flex lg:flex-row flex-col items-end justify-start gap-[52px] max-w-full z-[2] text-left text-13xl text-black font-yeseva-one mq1225:flex-wrap" >
			<div className="flex-1 rounded-tl-3xl rounded-tr-none rounded-br-3xl rounded-bl-none bg-white border-black border-t-[1px] border-solid  border-r-[1px]  border-b-[3px]  border-l-[1px]  box-border flex flex-col items-start justify-start pt-11 lg:px-10 px-6 pb-[70px] gap-[34px] max-w-full mq450:flex-1">
				<img
					className="w-[50px] h-[50px] relative overflow-hidden shrink-0 z-[1]"
					loading="lazy"
					alt=""
					src="/images/icon1.svg"
				/>
				<div className="self-stretch flex flex-col items-start justify-start gap-[11px]">
					<h2 className="m-0 self-stretch relative text-inherit leading-[140%] font-normal font-[inherit] z-[1] mq450:text-lgi mq450:leading-[27px] mq850:text-7xl mq850:leading-[36px]">
						Personalized Birthday Messages
					</h2>
					<div className="self-stretch h-[33px] relative text-base leading-[140%] font-roboto text-text inline-block z-[1]">
						Receive heartfelt greetings and blessings on your birthday.
					</div>
				</div>
			</div>
			<div className="flex-1 flex flex-col items-start justify-start pt-0 px-0 lg:pb-[50px] box-border lg:min-h-[388px] max-w-full">
				<div className="self-stretch rounded-tl-3xl rounded-tr-none rounded-br-3xl rounded-bl-none bg-white border-black border-t-[1px] border-solid  border-r-[1px]  border-b-[3px]  border-l-[1px] box-border flex flex-col items-start justify-start pt-11 lg:px-10 px-6 pb-[70px] gap-[34px] max-w-full">
					<img
						className="w-[50px] h-[50px] relative overflow-hidden shrink-0 z-[1]"
						loading="lazy"
						alt=""
						src="/images/icon2.svg"
					/>
					<div className="self-stretch flex flex-col items-start justify-start gap-[11px]">
						<h2 className="m-0 w-[234.5px] relative text-inherit leading-[140%] font-normal font-[inherit] inline-block z-[1] mq450:text-lgi mq450:leading-[27px] mq850:text-7xl mq850:leading-[36px]">
							Community Engagement
						</h2>
						<div className="self-stretch h-[33px] relative text-base leading-[140%] font-roboto text-text inline-block z-[1]">
							Strengthen your bond with the temple through regular, meaningful
							interactions.
						</div>
					</div>
				</div>
			</div>
			<div className="flex-1 rounded-tl-3xl rounded-tr-none rounded-br-3xl rounded-bl-none bg-white border-black border-t-[1px] border-solid border-r-[1px]  border-b-[3px]  border-l-[1px]  box-border flex flex-col items-start justify-start pt-11 lg:px-10 px-6 pb-[70px] gap-[34px] max-w-full mq450:flex-1">
				<img
					className="w-[50px] h-[50px] relative overflow-hidden shrink-0 z-[1]"
					loading="lazy"
					alt=""
					src="/images/icon3.svg"
				/>
				<div className="self-stretch flex flex-col items-start justify-start gap-[11px]">
					<h2 className="m-0 w-[234.5px] relative text-inherit leading-[140%] font-normal font-[inherit] inline-block z-[1] mq450:text-lgi mq450:leading-[27px] mq850:text-7xl mq850:leading-[36px]">
						Event Notifications
					</h2>
					<div className="self-stretch h-[33px] relative text-base leading-[140%] font-roboto text-text inline-block z-[1]">
						{" "}
						Stay updated on special events and celebrations happening at the
						temple.
					</div>
				</div>
			</div>
		</div>
	)
}

export default Services