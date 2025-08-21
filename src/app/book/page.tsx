import { Metadata } from 'next'
import BookingForm from '@/components/sections/booking-form'

export const metadata: Metadata = {
  title: 'Schedule a Meeting | Andrii Furmanets',
  description: 'Book a consultation or meeting with Andrii Furmanets. Choose from available time slots and schedule directly through Google Calendar.',
  keywords: ['book meeting', 'consultation', 'schedule', 'appointment', 'Andrii Furmanets'],
  openGraph: {
    title: 'Schedule a Meeting | Andrii Furmanets',
    description: 'Book a consultation or meeting with Andrii Furmanets.',
    type: 'website',
  },
}

export default function BookPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Schedule a Meeting
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to discuss your project or explore collaboration opportunities? 
              Choose a convenient time slot and I'll reach out to you directly.
            </p>
          </div>
          
          <BookingForm />
        </div>
      </div>
    </main>
  )
}