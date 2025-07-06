type Command = {
  type: 'INCOMING' | 'OUTGOING';
  action: string;
  payload: any;
  timestamp: number;
  handled?: boolean;
}

export class TyranCommandsTracker {
  private commands: Command[] = [];

  addCommand(command: Command): void {
    this.commands.push(command);

    window.postMessage({
      source: 'marino',
      type: 'clientCommandsTrackerUpdate',
      data: this.getCommands(),
    });
  }

  getCommands(): Command[] {
    return this.commands;
  }
}