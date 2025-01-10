import { Modding, OnStart, Service } from "@flamework/core";

import { OnCharacterAdd, OnCharacterRemove, OnPlayerJoin } from ".";

@Service({ loadOrder: 0 })
export default class CharacterAddService implements OnStart, OnPlayerJoin {
	private readonly AddListener = new Set<OnCharacterAdd>();
	private readonly RemoveListener = new Set<OnCharacterRemove>();
	onStart(): void {
		Modding.onListenerAdded<OnCharacterAdd>((obj) => this.AddListener.add(obj));
		Modding.onListenerRemoved<OnCharacterAdd>((obj) => this.AddListener.delete(obj));
		Modding.onListenerAdded<OnCharacterRemove>((obj) => this.RemoveListener.add(obj));
		Modding.onListenerRemoved<OnCharacterRemove>((obj) => this.RemoveListener.delete(obj));
	}

	onPlayerJoin(player: Player): void {
		player.CharacterAdded.Connect((character) => this.characterAdded(character));
		player.CharacterRemoving.Connect((character) => {
			for (const listener of this.RemoveListener) listener.onCharacterRemove(character as unknown as character);
		});
		if (player.Character !== undefined) this.characterAdded(player.Character);
	}

	private async characterAdded(character: Model) {
		for (const listener of this.AddListener)
			task.spawn(() => listener.onCharacterAdd(character as unknown as character));
	}
}
