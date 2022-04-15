window.onload = function(){

	document.getElementById("btnGetGames").addEventListener(
		"click",
		function(ev){
			let url = 'https://bgg-json.azurewebsites.net/collection/edwalter';
			fetch(url).then(
				response => {
					return response.json();
				}
			).then(
				result => {
					result = result.map(item=>`<li>${item.name}</li>`)
						  .join('');
					document.body.innerHTML += `<ul>${result}</ul>`;
				}
			).catch(
				fout => {
					console.log(`Ging iets fout: ${fout}`);
				}
			);
		}
	);


	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js').then(
			registratie=> {
				console.log(`Registratie gelukt: ${registratie.scope}`);

				if ('PushManager' in window){
					console.log("Push berichten worden ondersteund!");						
					
					Notification.requestPermission().then(
						antwoord => {
							if (antwoord === 'default'){
								console.log('Helaas; notificatie verzoek weggeklikt');
								return;
							}
							
							if (antwoord === 'denied'){
								console.log('Helaas; notificaties geweigerd');
								return;
							}
						
							if (antwoord==='granted'){
								console.log('Hoera! We hebben toestemming voor notificaties');
								
								// Check bestaande registratie en maak gebruiker:
								registratie.pushManager.getSubscription().then(
										sub =>{
											if (sub === null) {
												console.log("Er is nog geen geregistreerde Push-gebruiker");
												maakPushUser(registratie);
											}
										}
								);
							}
						}
					);
				}
			}
		).catch(
			fout=> {
				console.log(`Er is iets foutgegaan: ${fout}`);
			}
		);

		function maakPushUser(registratie){				   
			const publicKey = urlBase64ToUint8Array('BO_jVugPTE8AMOQqIGWEPcbJWRKI6nI6IdnH7vLN4_KoPMn9hySs9-w-b4cMytP3Z_YnZeFh2lWqJD2xepMitTY');
			
			registratie.pushManager.subscribe(
				{
					userVisibleOnly: true,
					applicationServerKey: publicKey
				}
			).then(
				sub => {
					updateSubscriptionAtServer(sub);
					console.log("User geabonneerd op meldingen");
				}
			).catch(
				fout => {
					console.log(`Abonneren op notificaties niet gelukt: ${fout}`);
				}
			);
		}
		
		function updateSubscriptionAtServer(subscriptie){
			/* Hier schrijven we normaal info naar de server */
			console.dir(subscriptie);
		}
		
		
		/**
		 * urlBase64ToUint8Array -- GOOGLE Functie
		 * 
		 * @param {string} base64String a public vavid key
		 */
		function urlBase64ToUint8Array(base64String) {
			var padding = '='.repeat((4 - base64String.length % 4) % 4);
			var base64 = (base64String + padding)
				.replace(/\-/g, '+')
				.replace(/_/g, '/');

			var rawData = window.atob(base64);
			var outputArray = new Uint8Array(rawData.length);

			for (var i = 0; i < rawData.length; ++i) {
				outputArray[i] = rawData.charCodeAt(i);
			}
			return outputArray;
		}
	}
}
