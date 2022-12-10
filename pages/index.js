import Image from 'next/image'
import splatfestimage from '../public/splatfest.jpg'

import stagemap00 from '../public/maps/0.jpg'
import stagemap01 from '../public/maps/1.jpg'
import stagemap02 from '../public/maps/2.jpg'
import stagemap03 from '../public/maps/3.jpg'
import stagemap04 from '../public/maps/4.jpg'
import stagemap05 from '../public/maps/5.jpg'
import stagemap06 from '../public/maps/6.jpg'
import stagemap07 from '../public/maps/7.jpg'
import stagemap08 from '../public/maps/8.jpg'
import stagemap09 from '../public/maps/9.jpg'
import stagemap10 from '../public/maps/10.jpg'
import stagemap11 from '../public/maps/11.jpg'
import stagemap12 from '../public/maps/12.jpg'
import stagemap13 from '../public/maps/13.jpg'
import stagemap14 from '../public/maps/14.jpg'
import stagemap15 from '../public/maps/15.jpg'

const stages = [stagemap00,stagemap01,stagemap02,stagemap03,stagemap04,stagemap05,stagemap06,stagemap07,stagemap08,stagemap09,stagemap10,stagemap11,stagemap12,stagemap13,stagemap14,stagemap15]

import { GetSplatfestData, GetMapRotations,UseNintendoRotation } from '../utils/fetcher';

export async function getServerSideProps(ctx) {
	
	const useNintendo = false
	const forceSplatfests = true
	UseNintendoRotation(useNintendo)

    const splatfestinfoarray = await GetSplatfestData()
	const timestart = new Date(splatfestinfoarray[1][1] * 1000)
	const timestartformat = `${timestart.toLocaleString('default', { month: 'long' })} ${timestart.getDate()} ${(timestart.getHours() >= 10) ? timestart.getHours() : "0" + timestart.getHours()}:${(timestart.getMinutes() >= 10) ? timestart.getMinutes() : "0" + timestart.getMinutes()}`
	const timeend = new Date(splatfestinfoarray[1][2] * 1000)
	const timeendformat = `${timeend.toLocaleString('default', { month: 'long' })} ${timeend.getDate()} ${(timeend.getHours() >= 10) ? timeend.getHours() : "0" + timeend.getHours()}:${(timeend.getMinutes() >= 10) ? timeend.getMinutes() : "0" + timeend.getMinutes()}`

	let avaliable = false
	let Sstatus = ""
	const currentTime =  Date.parse(new Date()) / 1000
	if (currentTime < splatfestinfoarray[1][3] || forceSplatfests){
		avaliable = true
		if (forceSplatfests) {
			Sstatus = "FORCE_LOADED"
		}
		else if (currentTime >= splatfestinfoarray[1][1]) {
			Sstatus = "Live!"
		}
		else if (currentTime >= splatfestinfoarray[1][0]) {
			Sstatus = "Inkoming!"
		}
		else {
			avaliable = false
		}
	}

    const splatfest = {
		theme: `${splatfestinfoarray[0][0]} vs ${splatfestinfoarray[0][1]}`,
		timeOfFest: `${timestartformat} - ${timeendformat}`,
		stages: splatfestinfoarray[2],
		stagesID: splatfestinfoarray[3],
		gamemode: splatfestinfoarray[4],
		avaliable: avaliable,
		Sstatus: Sstatus
	}

//Get current Rotation as well as the next one if available
	const rotationsarray = await GetMapRotations()
	console.log(rotationsarray[0])
	const currentrotationarray = rotationsarray[0]
	const hasNext = (rotationsarray.length >= 2)
	const currentrotation = {
		normalStages: currentrotationarray[0],
		normalIDs: currentrotationarray[1],
		rankedmode: currentrotationarray[2],
		rankedStages: currentrotationarray[3],
		rankedIDs: currentrotationarray[4]
	}
	/*var nextrotation = {avaliable: false}
	if (hasNext) {
		const nextrotationarray = rotationsarray[1]
		nextrotation = {
			normalStages: nextrotationarray[0],
			normalIDs: nextrotationarray[1],
			rankedmode: nextrotationarray[2],
			rankedStages: nextrotationarray[3],
			rankedIDs: nextrotationarray[4],
			avaliable: true
		} 
	} */

	const rotationdata = {currentrotation}
	return {
		props: {
			splatfest,
            rotationdata,
		},
	};
}


function Home({splatfest,rotationdata}) {
    return (
        <div class="container">
	<div class="main-title">
		<div class="title"><b>Splatoon Map Rotation</b></div>
		<div class="description">Check the current map rotation and splatfest info for Splatoon on Pretendo Network</div>
	</div>
	<div class="splatfest">
		<div class="splatfest-theme"><b>Splatfest: {splatfest.theme}</b></div>
		<div class="splatfest-time">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></rect><line x1="176" y1="20" x2="176" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="80" y1="20" x2="80" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>{splatfest.timeOfFest}
		</div>
		<div class="splatfest-image-container">
			<Image className="splatfest-image" src={splatfestimage} alt=""/>
		</div>
		<div class="splatfest-stages">
			<div class="stage">
				<div class="stage-name">{splatfest.stages[0]}</div>
				<Image className="stage-image" src={stages[splatfest.stagesID[0]]} alt=""/>
			</div>
            <div class="stage">
				<div class="stage-name">{splatfest.stages[1]}</div>
				<Image className="stage-image" src={stages[splatfest.stagesID[1]]} alt=""/>
			</div>
            <div class="stage">
				<div class="stage-name">{splatfest.stages[2]}</div>
				<Image class="stage-image" src={stages[splatfest.stagesID[2]]} alt=""/>
			</div>
		</div>
	</div>
	<div class="rotations">
		<div class= "rotations-container">
				<div class="title-mode green-full"><b>Regular Battles</b></div>
				<div class="title-mode orange-full"><b>Ranked Battles</b></div>
				<div class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></svg><b>Now</b></div>
				<div class="rotation-container green-full">
					<div class="stages-container">
						<div class="stage">
							<div class="stage-name">{rotationdata.currentrotation.normalStages[0]}</div>
							<Image className="stage-image" src={stages[rotationdata.currentrotation.normalIDs[0]]} alt=""/>
						</div>
            			<div class="stage">
							<div class="stage-name">{rotationdata.currentrotation.normalStages[1]}</div>
							<Image class="stage-image" src={stages[rotationdata.currentrotation.normalIDs[1]]} alt=""/>
						</div>
					</div>
					<div class="rotation-mode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></rect><line x1="42.3" y1="42.3" x2="213.7" y2="213.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>Turf War</div>
					<div class="rotation-time"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></svg>Time Oh My</div>
				</div>
				<div class="rotation-container orange-full">
					<div class="stages-container">
						<div class="stage">
							<div class="stage-name">{rotationdata.currentrotation.rankedStages[0]}</div>
							<Image className="stage-image" src={stages[rotationdata.currentrotation.rankedIDs[0]]} alt=""/>
						</div>
            			<div class="stage">
							<div class="stage-name">{rotationdata.currentrotation.rankedStages[1]}</div>
							<Image class="stage-image" src={stages[rotationdata.currentrotation.rankedIDs[1]]} alt=""/>
						</div>
					</div>
					<div class="rotation-mode"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></rect><line x1="42.3" y1="42.3" x2="213.7" y2="213.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>{rotationdata.currentrotation.rankedmode}</div>
					<div class="rotation-time"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></svg>Time Oh My</div>
				</div>
				<div class="separator"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></svg><b>Now</b></div>
		</div>
	</div>
</div>
    )
}

export default Home

//<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></rect><line x1="42.3" y1="42.3" x2="213.7" y2="213.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>{rotationdata.currentrotation.rankedmode}
					//<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></circle><polyline points="128 72 128 128 184 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></svg> 9:00 AM - 11:00  AM