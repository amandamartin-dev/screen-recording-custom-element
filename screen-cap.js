const createButton = () => {
    const div = document.createElement('main');
    const html = `<p style="color:white">This example will record your screen and save the file. Click the Share Screen button to begin.</p>
    <p>
    <button class="capture" id="start">Share Screen</button>&nbsp;
    <button class="record" id="record">Start Recording</button>&nbsp;
    <button class="stop" id="stop">Stop Recording</button>
    </p>`;
    div.innerHTML = html;
    return div;
};

const createStyle = () => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
  main {
    font-size: 12px;
  }

  button{
    margin: 5px;
    padding: 5px 10px;
    border-radius: 2px;
  }

  .capture {
    background-color: yellow;
  }

   .record {
    background-color: green;
    font-color: white;
  }

   .stop {
    background-color: red;
    font-color: white;
  }`
    return styleElement;
};

class ScreenCap extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let stream;
        let recorder;

        this.appendChild(createStyle());
        this.appendChild(createButton());
        this.querySelector(".capture").addEventListener("click", async () => {
            try {
                stream = await navigator.mediaDevices.getDisplayMedia();
                recorder = new MediaRecorder(stream);
            } catch (error) {
                console.error(`Error: ${err}`);
            }

        });

        this.querySelector(".record").addEventListener("click", async () => {
            const suggestedName = "screen-recording.webm";
            const handle = await window.showSaveFilePicker({ suggestedName });
            const writable = await handle.createWritable();

            recorder.start();
            recorder.addEventListener("dataavailable", async (event) => {
                await writable.write(event.data);
                if (recorder.state === "inactive") {
                    await writable.close();
                }
            });
        });

        this.querySelector(".stop").addEventListener("click", () => {
            recorder.stop();
        });

    }
}

customElements.define('screen-cap', ScreenCap);
