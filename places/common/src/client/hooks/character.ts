import { Controller, Modding, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

import { OnCharacterAdd, OnCharacterRemove } from ".";

@Controller({ loadOrder: 1 })
export class CharacterAddController implements OnStart {
	private readonly AddListener = new Set<OnCharacterAdd>();
	private readonly RemoveListener = new Set<OnCharacterRemove>();
	onStart(): void {
		Modding.onListenerAdded<OnCharacterAdd>((obj) => this.AddListener.add(obj));
		Modding.onListenerRemoved<OnCharacterAdd>((obj) => this.AddListener.delete(obj));
		Modding.onListenerAdded<OnCharacterRemove>((obj) => this.RemoveListener.add(obj));
		Modding.onListenerRemoved<OnCharacterRemove>((obj) => this.RemoveListener.delete(obj));
		Players.LocalPlayer.CharacterAdded.Connect((character) => {
			for (const listener of this.AddListener) listener.onCharacterAdd(character as character);
		});
		Players.LocalPlayer.CharacterRemoving.Connect((character) => {
			for (const listener of this.RemoveListener) listener.onCharacterRemove(character as character);
		});
		if (Players.LocalPlayer.Character)
			for (const listener of this.AddListener)
				listener.onCharacterAdd(Players.LocalPlayer.Character! as character);
	}
}
