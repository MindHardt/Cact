import {Button, Calendar, DateField, DatePicker} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {CalendarDays, RotateCcw} from "lucide-react";
import {format} from "date-fns";
import {useState} from "react";


export default function DaySelector({ day, setDay } : {
    day: string | undefined,
    setDay: (day: string | undefined) => void
}) {

    const [open, setOpen] = useState(false);

    return (
        <DatePicker
            isOpen={open}
            onOpenChange={setOpen}
            aria-label="day"
            name="day"
            value={parseDate(day ?? format(new Date(), 'yyyy-MM-dd'))}
            onChange={e => setDay(e?.toString())}
        >
            <DateField.Group fullWidth>
                <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                <DateField.Suffix className='gap-2'>
                    <Button size='sm' variant='secondary' onClick={() => setOpen(true)}>
                        <CalendarDays />
                    </Button>
                    <Button size='sm' onClick={() => { setDay(undefined); setOpen(false); }}>
                        <RotateCcw />
                    </Button>
                </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
                <Calendar aria-label="Event date">
                    <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                        <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({year}) => <Calendar.YearPickerCell year={year} />}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </DatePicker.Popover>
        </DatePicker>
    )
}