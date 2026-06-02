import { Surface } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Surface className='flex flex-col gap-2 text-center rounded-lg p-2'>
      <h1 className='text-2xl font-bold'>Cact</h1>
      <p>Сокращение от <b>Ca</b>lorie <b>c</b>oun<b>t</b>er</p>
      <p>Приложение для учёта питания и калорийности блюд</p>
      <p>С его помощью вы можете отслеживать потребление КБЖУ в еде и контроллировать свой вес.</p>
      <p>Разработчик - <a className='text-blue-400 hover:text-blue-600' href='https://un1ver5e.tech' target='_blank' rel='noopener noreferrer'>Игорь Бабин</a></p>
    </Surface>
  )
}
