import { Card } from '@heroui/react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import FoodForm from './-form/food-form'
import BackButton from '#/components/back-button'

export const Route = createFileRoute('/foods/new')({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return (
    <div className='flex flex-col gap-2'>
      <BackButton navigate={{ to: '/foods' }} />
      <Card className='text-center'>
        <Card.Content>
          <FoodForm readonly={false} />
        </Card.Content>
      </Card>
    </div>
  )
}
