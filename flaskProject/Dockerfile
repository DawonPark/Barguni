FROM ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install tesseract-ocr -y \
    python3 \
    #python-setuptools \
    python3-pip \
    && apt-get clean \
    && apt-get autoremove \
    && apt-get install git -y

ADD . /home/App
WORKDIR /home/App
COPY requirements.txt ./
COPY . .
COPY /train/kor.traineddata /usr/share/tesseract-ocr/4.00/tessdata/

RUN pip3 install -r requirements.txt
RUN pip3 install fvcore-master.zip
RUN python3 setup.py build develop

VOLUME ["/data"]
CMD ["python3","app.py"]