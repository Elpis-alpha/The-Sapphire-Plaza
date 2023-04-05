type BSelectType = {
	className?: string
	options?: optType[]
	onInput?: Function
}

type activeMenutype = "breakfast" | "soup" | "grill" | "pasta" | "pizza" | "drink"

type InputType = {
	label: string
	type: HTMLInputTypeAttribute 
	placeholder: string
}