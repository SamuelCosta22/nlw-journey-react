import logoImg from '../../../public/logo.svg'
import { FormEvent, useState } from 'react'
import { errorToEnter } from '../../toasts/toasts'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { InviteGuestsModal } from './invite-guests-modal';
import { ConfirmTripModal } from './confirm-trip-modal';
import { DestinationAndDateStep } from './Steps/destination-and-date-step';
import { InviteGuestsStep } from './Steps/invite-guests-step';
import { DateRange } from 'react-day-picker';
import { api } from '../../lib/axios';

export function CreateTripPage() {
    const navigate = useNavigate();
    const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
    const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
    const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

    const [destination, setDestination] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerEmail, setOwnerEmail] = useState('');
    const[eventStartAndDates, setEventStartAndDates] = useState<DateRange | undefined>();

    
    const [emailsToInvite, setEmailsToInvite] = useState([
        'diego@rocketseat.com.br',
    ]);

    function openGuestsInputs(){
        setIsGuestsInputOpen(true)
    }
    function closeGuestsInputs(){
        setIsGuestsInputOpen(false)
    }

    function openGuestsModal(){
        setIsGuestsModalOpen(true)
    }
    function closeGuestsModal(){
        setIsGuestsModalOpen(false)
    }

    function openConfirmTripModal(){
        setIsConfirmTripModalOpen(true)
    }
    function closeConfirmTripModal(){
        setIsConfirmTripModalOpen(false)
    }

    function addNewEmailToInvite(event: FormEvent<HTMLFormElement>){
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString();

        if(!email){
        return;
        }

        if(emailsToInvite.includes(email)){
        errorToEnter('Este email já foi convidado!');
        return;
        }

        setEmailsToInvite([
        ...emailsToInvite,
        email
        ]);

        event.currentTarget.reset()
    }
    function removeEmailToInvite(emailToRemove: string){
        const newEmailList = emailsToInvite.filter(invited => invited !== emailToRemove);
        setEmailsToInvite(newEmailList);
    }

    async function createTrip(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        console.log(destination);
        console.log(ownerName);
        console.log(ownerEmail);
        console.log(emailsToInvite);
        console.log(eventStartAndDates);
        
        if (!destination) {
            return
        }
    
        if (!eventStartAndDates?.from || !eventStartAndDates?.to) {
            return
        }
    
        if (emailsToInvite.length === 0) {
            return
        }
    
        if (!ownerName || !ownerEmail) {
            return
        }

        const response = await api.post('/trips', {
            destination,
            starts_at: eventStartAndDates.from,
            ends_at: eventStartAndDates.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
          })
      
          const { tripId } = response.data
      
          navigate(`/trips/${tripId}`)
    }

    return (
        <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className='flex flex-col items-center gap-3'>
                    <img src={logoImg} alt="Logo plann.er" />
                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>
                
                <div className='space-y-4'>
                    <DestinationAndDateStep isGuestsInputOpen={isGuestsInputOpen} closeGuestsInputs={closeGuestsInputs} openGuestsInputs={openGuestsInputs} setDestination={setDestination} eventStartAndDates={eventStartAndDates} setEventStartAndDates={setEventStartAndDates} />

                    {isGuestsInputOpen && (
                        <InviteGuestsStep emailsToInvite={emailsToInvite} openConfirmTripModal={openConfirmTripModal} openGuestsModal={openGuestsModal} />
                    )}
                </div>

                <p className="text-zinc-500 text-sm">
                    Ao planejar sua viagem pela plann.er você automaticamente concorda <br /> com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade.</a>
                </p> 
            </div>

            {isGuestsModalOpen && (
                <InviteGuestsModal addNewEmailToInvite={addNewEmailToInvite} closeGuestsModal={closeGuestsModal} emailsToInvite={emailsToInvite} removeEmailToInvite={removeEmailToInvite} />
            )}

            {isConfirmTripModalOpen && (
                <ConfirmTripModal closeConfirmTripModal={closeConfirmTripModal} createTrip={createTrip} setOwnerName={setOwnerName} setOwnerEmail={setOwnerEmail } />
            )}

            <ToastContainer />
        </div>
    )
}